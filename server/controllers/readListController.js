const ReadingList = require('../models/ReadListModel');
const mongoose = require('mongoose');

const readListController = {
  // Add book to reading list
  addToReadList: async (req, res) => {
    try {
      const { googleBookId, status = 'wantToRead' } = req.body;
      const userId = req.user._id;

      // Validate required fields
      if (!googleBookId) {
        return res.status(400).json({ 
          error: 'googleBookId is required',
          received: { googleBookId, status }
        });
      }

      if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
      }

      // Validate status
      const validStatuses = ['wantToRead', 'currentlyReading', 'finishedReading'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status', 
          validStatuses,
          received: status
        });
      }

      // Check if book already exists in user's reading list
      const existingItem = await ReadingList.findOne({
        user: userId,
        googleBookId: googleBookId
      });

      if (existingItem) {
        return res.status(409).json({ 
          error: 'Book already exists in your reading list',
          currentStatus: existingItem.status,
          bookId: googleBookId
        });
      }

      // Create new reading list item
      const readListItem = new ReadingList({
        user: userId,
        googleBookId: googleBookId,
        status: status,
        addedAt: new Date(),
        updatedAt: new Date()
      });

      const savedItem = await readListItem.save();

      res.status(201).json({
        message: 'Book added to reading list successfully',
        item: savedItem
      });

    } catch (error) {
      console.error('Error adding to reading list:', error);
      
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        return res.status(409).json({ 
          error: 'Book already exists in your reading list' 
        });
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: validationErrors 
        });
      }

      res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get user's reading list
  getReadList: async (req, res) => {
    try {
      const userId = req.user._id;
      const { status } = req.query;

      if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
      }

      // Build query
      const query = { user: userId };
      if (status && ['wantToRead', 'currentlyReading', 'finishedReading'].includes(status)) {
        query.status = status;
      }

      const readingList = await ReadingList.find(query)
        .populate('user', 'name email')
        .sort({ updatedAt: -1 });

      res.status(200).json(readingList);

    } catch (error) {
      console.error('Error fetching reading list:', error);
      res.status(500).json({ 
        error: 'Failed to fetch reading list',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Update reading list item status
  updateReadListItem: async (req, res) => {
    try {
      const { googleBookId } = req.params;
      const { status, favorite, isPublic } = req.body;
      const userId = req.user._id;

      if (!googleBookId) {
        return res.status(400).json({ error: 'googleBookId is required' });
      }

      // Validate status if provided
      if (status && !['wantToRead', 'currentlyReading', 'finishedReading'].includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status',
          validStatuses: ['wantToRead', 'currentlyReading', 'finishedReading']
        });
      }

      // Build update object
      const updateData = { updatedAt: new Date() };
      if (status !== undefined) updateData.status = status;
      if (favorite !== undefined) updateData.favorite = favorite;
      if (isPublic !== undefined) updateData.isPublic = isPublic;

      const updatedItem = await ReadingList.findOneAndUpdate(
        { user: userId, googleBookId: googleBookId },
        updateData,
        { new: true, runValidators: true }
      ).populate('user', 'name email');

      if (!updatedItem) {
        return res.status(404).json({ 
          error: 'Book not found in your reading list',
          googleBookId: googleBookId
        });
      }

      res.status(200).json({
        message: 'Reading list item updated successfully',
        item: updatedItem
      });

    } catch (error) {
      console.error('Error updating reading list item:', error);
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: validationErrors 
        });
      }

      res.status(500).json({ 
        error: 'Failed to update reading list item',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Remove book from reading list
  removeFromReadList: async (req, res) => {
    try {
      const { googleBookId } = req.params;
      const userId = req.user._id;

      if (!googleBookId) {
        return res.status(400).json({ error: 'googleBookId is required' });
      }

      const deletedItem = await ReadingList.findOneAndDelete({
        user: userId,
        googleBookId: googleBookId
      });

      if (!deletedItem) {
        return res.status(404).json({ 
          error: 'Book not found in your reading list',
          googleBookId: googleBookId
        });
      }

      res.status(200).json({
        message: 'Book removed from reading list successfully',
        removedItem: deletedItem
      });

    } catch (error) {
      console.error('Error removing from reading list:', error);
      res.status(500).json({ 
        error: 'Failed to remove book from reading list',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = readListController;