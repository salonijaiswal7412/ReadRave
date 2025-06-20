const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const query = req.query.q || 'fiction';
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`;

  try {
    const fetch = await import('node-fetch'); 
    const response = await fetch.default(url); 
    const data = await response.json();

    const books = data.items?.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ['Unknown'],
      description: item.volumeInfo.description || 'No description available',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories || [],
    })) || [];

    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch from Google Books API' });
  }
});

module.exports = router;
