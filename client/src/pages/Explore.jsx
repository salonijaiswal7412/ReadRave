import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import CommonFooter from '../components/CommonFooter';
const VITE_API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

const genres = [ "Fantasy",
  "Science Fiction",
  "Romance",
  "Thriller",
  "Mystery",
  "Historical Fiction",
  "Memoirs",
  "Horror",
  "Literary Fiction"];

const Explore = () => {
  const [booksByGenre, setBooksByGenre] = useState({});
  const [loadingGenres, setLoadingGenres] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    genres.forEach(async (genre) => {
      setLoadingGenres((prev) => ({ ...prev, [genre]: true }));
      try {
        const res = await axios.get(`${VITE_API_BASE_URL}/api/genres`, {
          params: { genre },
        });

        setBooksByGenre((prev) => ({
          ...prev,
          [genre]: res.data,
        }));
      } catch (err) {
        console.error(`Failed to fetch books for ${genre}`, err);
      } finally {
        setLoadingGenres((prev) => ({ ...prev, [genre]: false }));
      }
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="px-6 py-10">
        <h1 className="text-6xl font-bold text-center text-[#d91c7d] mb-10 mt-10 uppercase tracking-tighter">
          Explore Books by Genre
        </h1>

        {genres.map((genre) => (
          <div
            key={genre}
            className="mb-12 p-4 rounded-xl shadow-[0_0_1rem] shadow-gray-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-[#d91c7d]">{genre}</h2>
              <button
                onClick={() => navigate(`/genre/${encodeURIComponent(genre)}`)}
                className="text-sm text-[#d91c7d] hover:underline font-medium"
              >
                View All
              </button>
            </div>

            <div className="flex overflow-x-auto gap-2 scrollbar-hide justify-evenly min-h-[200px] items-center">
              {loadingGenres[genre] ? (
                <div className="w-full text-center py-10">
                  <div className="w-10 h-10 border-4 border-[#d91c7d] border-dashed rounded-full animate-spin mx-auto"></div>
                </div>
              ) : (
                (booksByGenre[genre] || [])
                  .slice(0, 6)
                  .map((book) => (
                    <Link key={book.id} to={`/book/${book.id}`}>
                      <div className="m-2 h-68 w-42 min-w-[10rem] bg-white p-2 rounded-xl shadow-[0_0_1.2rem] shadow-gray-400">
                        <img
                          src={
                            book.volumeInfo.imageLinks?.thumbnail ||
                            'https://via.placeholder.com/128x200?text=No+Image'
                          }
                          alt={book.volumeInfo.title}
                          className="w-[90%] m-auto h-46 rounded-r-xl object-cover rounded"
                        />
                        <h3 className="mt-2 text-md font-semibold line-clamp-2 text-center text-[#d91c7d]">
                          {book.volumeInfo.title}
                        </h3>
                        <p className="text-xs text-gray-500 text-center line-clamp-1">
                          {book.volumeInfo.authors?.[0] || 'Unknown Author'}
                        </p>
                      </div>
                    </Link>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>
      <CommonFooter />
    </div>
  );
};

export default Explore;
