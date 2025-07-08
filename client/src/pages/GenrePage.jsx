import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CommonFooter from '../components/CommonFooter';
const VITE_API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

const GenrePage = () => {
  const { genreName } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${VITE_API_BASE_URL}/api/genres`, {
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
      <div className="px-3 xs:px-4 sm:px-6 md:px-8 py-6 xs:py-8 sm:py-10">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#d91c7d] mb-6 xs:mb-8 mt-4 xs:mt-6 sm:mt-8 tracking-tight uppercase">
          {genreName} Books
        </h1>

        {loading && (
          <p className="text-center text-gray-600 h-[50vh] xs:h-[60vh] sm:h-[70vh]">
            Loading...
          </p>
        )}
        
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6 justify-items-center auto-rows-fr">
          {books.map((book) => (
            <Link key={book.id} to={`/book/${book.id}`} className="w-full max-w-[200px]">
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-[0_0_1rem] shadow-gray-400 hover:shadow-lg transition-all w-full h-full min-h-[280px] sm:min-h-[300px] md:min-h-[320px] flex flex-col">
                <div className="flex-shrink-0 mb-3">
                  <img
                    src={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      'https://via.placeholder.com/128x200?text=No+Image'
                    }
                    alt={book.volumeInfo.title}
                    className="w-full h-40 sm:h-44 md:h-48 object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold line-clamp-2 text-center text-[#d91c7d] mb-2">
                    {book.volumeInfo.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 text-center line-clamp-1">
                    {book.volumeInfo.authors?.[0] || 'Unknown Author'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <CommonFooter />
    </div>
  );
};

export default GenrePage;