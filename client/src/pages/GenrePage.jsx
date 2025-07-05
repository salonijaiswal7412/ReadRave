import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CommonFooter from '../components/CommonFooter';

const GenrePage = () => {
  const { genreName } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/genres', {
          params: { genre: genreName },
        });
        setBooks(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load books. Try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genreName]);

  return (
    <div>
      <Navbar />
      <div className="px-6 py-10">
        <h1 className="text-5xl font-bold text-center text-[#d91c7d] mb-8 mt-8 tracking-tight uppercase ">
          {genreName} Books
        </h1>

        {loading && <p className="text-center text-gray-600 h-[70vh]">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <Link key={book.id} to={`/book/${book.id}`}>
              <div className="bg-white p-3 rounded-xl shadow-[0_0_1rem] h-76 w-52 shadow-gray-400 hover:shadow-lg transition-all">
                <img
                  src={
                    book.volumeInfo.imageLinks?.thumbnail ||
                    'https://via.placeholder.com/128x200?text=No+Image'
                  }
                  alt={book.volumeInfo.title}
                  className="w-full h-52 object-cover rounded-lg"
                />
                <h3 className="mt-2 text-md font-semibold line-clamp-2 text-center text-[#d91c7d]">
                  {book.volumeInfo.title}
                </h3>
                <p className="text-xs text-gray-500 text-center line-clamp-1">
                  {book.volumeInfo.authors?.[0] || 'Unknown Author'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <CommonFooter/>
    </div>
    
  );
};

export default GenrePage;
