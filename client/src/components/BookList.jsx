import React, { useEffect, useState } from 'react';
const VITE_API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('fiction');

  const fetchBooks = (searchTerm) => {
    fetch(`${VITE_API_BASE_URL}/api/google-books?q=${encodeURIComponent(searchTerm)}`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBooks(query);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(query);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
          className="p-2 border rounded mr-2"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.id} className="p-4 border rounded shadow">
            {book.thumbnail && <img src={book.thumbnail} alt={book.title} className="mb-2" />}
            <h3 className="text-lg font-bold">{book.title}</h3>
            <p className="text-sm text-gray-700">{book.authors.join(', ')}</p>
            <p className="text-sm">{book.description.slice(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
