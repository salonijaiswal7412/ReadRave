const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const path = require('path');


const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

const signupUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.signup(name, email, password);
        const token = createToken(user._id);
        res.status(200).json({ email, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }


};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ user, token, message: 'successfully logged in' });
    } catch (error) {

        res.status(400).json({ error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name email profilePic bio favourites');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user }); // just sending name and email inside a 'user' object
    } catch (error) {
        console.error('Error in getProfile:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePic: imageUrl },
            { new: true }
        ).select('name email profilePic');

        res.status(200).json({message:'Profile successfully updated',user});
    }
    catch(error){
        console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Server error' });
    }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { name, bio } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updates = {};
    if (name) updates.name = name;
    if (bio) updates.bio = bio;
    if (profilePic) updates.profilePic = profilePic;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select('name email bio profilePic');

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const addFavourite = async (req, res) => {
    try {
        // Comprehensive debugging
       
        
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const userId = req.user._id;
        const { book } = req.body;

        if (!book) {
            return res.status(400).json({ message: 'Book data is required' });
        }

        console.log('Searching for user with ID:', userId);
        
        // Try to find user again
        const user = await User.findById(userId);
    
        
        if (!user) {
            
            return res.status(404).json({ message: 'User not found' });
        }

       

        const alreadySaved = user.favourites.some(
            (fav) => fav.googleBookId === book.googleBookId
        );

        if (alreadySaved) {
            return res.status(409).json({ message: 'Book already in favourites' });
        }

        user.favourites.push(book);
        await user.save();

        res.status(200).json({ message: 'Book added to favourites' });
        
    } catch (error) {
       
        res.status(500).json({ message: 'Internal server error' });
    }
};

const removeFavourite=async (req,res)=>{
const userId=req.user.id;
const bookId=req.params.bookId;
try{
    const user=await User.findById(userId);
    user.favourites=user.favourites.filter((book)=>book.googleBookId!=bookId);

    await user.save();
    res.status(200).json({ message: 'Book removed from favourites' });
}
catch(err){
    console.error('Error removing favourite:', err);
    res.status(500).json({ message: 'Failed to remove favourite' });
}
};


module.exports = { signupUser, loginUser, getProfile, updateProfilePicture ,updateProfile
,addFavourite,removeFavourite};