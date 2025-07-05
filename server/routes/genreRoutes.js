// server/routes/genreRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

router.get('/', async (req, res) => {
  const genre = req.query.genre || 'fiction';

  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
      params: {
        q: `subject:${genre}`,
        maxResults: 40,
        key: GOOGLE_BOOKS_API_KEY,
      },
    });

    res.json(response.data.items || []);
  } catch (error) {
    console.error(`Error fetching books for ${genre}:`, error.message);
    res.status(500).json({ message: 'Failed to fetch books.' });
  }
});

module.exports = router;
