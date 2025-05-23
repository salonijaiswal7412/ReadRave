import React from 'react'
import Navbar from '../components/Navbar'
import {useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';

const BookDetail = () => {
  const {id}=useParams();
  const [book,setBook]=useState(null);
  const [reviews,setReviews]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error, setError] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(()=>{
    console.log('component mounted,id : ',id);
    if(!id){
      setError('no book id available');
      setLoading(false);
      return;
    }

    // Fetch book data
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
    .then(response=>{
      console.log('Response status:',response.status);
      if(!response.ok){
        throw new Error(`Http error|${response.status}`);
      }
      return response.json();
    })
    .then(data=>{
      console.log('Book data: ',data);
      setBook(data);
      setLoading(false);
    })
    .catch(err=>{
      console.error('fetch error: ',err);
      setError(`failed to load book :${err.message}`);
      setLoading(false);
    });

    // Fetch reviews
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await fetch(`http://localhost:5000/api/reviews/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Reviews data:', data);
          setReviews(Array.isArray(data) ? data : []);
        } else {
          console.log('No reviews found or API not available');
          setReviews([]);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  },[id]);

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 mb-4 text-lg font-semibold">⚠️ {error}</div>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Try Again
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Loading book details...</span>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-6">
        <div className="text-lg text-gray-600">📚 No book data found</div>
        <div className="text-sm text-gray-500 mt-2">Book ID: {id}</div>
      </div>
    );
  }
  
  const title = book.volumeInfo?.title || 'Unknown Title';
  const authors = book.volumeInfo?.authors?.join(', ') || 'Unknown Author';
  const publishedDate = book.volumeInfo?.publishedDate || 'Unknown';
  const pageCount = book.volumeInfo?.pageCount;
  const categories = book.volumeInfo?.categories?.join(', ');
  const publisher = book.volumeInfo?.publisher;

  const cleanDescription = (desc) => {
    if (!desc) return 'No description available';
    return desc.replace(/<[^>]*>/g, '');
  };
  const description = cleanDescription(book.volumeInfo?.description);
  const thumbnail = book.volumeInfo?.imageLinks?.thumbnail;
  
  // Calculate average rating from reviews
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
    : null;
  
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-white">
        <div className="p-4 pt-6">
          {/* Book Cover for Mobile */}
          {thumbnail && (
            <div className="flex justify-center mb-6">
              <img
                src={thumbnail}
                alt={title}
                className="w-48 h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Book Info for Mobile */}
          <div className="space-y-4">
            <h1 className='text-3xl font-bold text-[#D91C7D] text-center'>{title}</h1>
            <h2 className='text-xl text-gray-500 text-center'>{authors}</h2>
            
            <p className='text-sm text-justify leading-relaxed'>{description}</p>
            
            <div className='space-y-2'>
              <div className='text-[#d91c7e] text-sm font-medium'>GENRES:</div>
              <div className='text-sm text-gray-500 font-semibold'>{categories}</div>
            </div>

            <div className='text-xs text-gray-600 space-y-1'>
              {pageCount && <p>{pageCount} pages</p>}
              <p>First published on - {publishedDate}</p>
              {publisher && <p>Publisher - {publisher}</p>}
            </div>

            {/* Average Rating for Mobile */}
            {averageRating && (
              <div className="mt-4">
                <span className="font-semibold text-gray-700">Average Rating:</span>
                <span className="ml-2 text-yellow-500">⭐ {averageRating}/5</span>
                <span className="ml-2 text-gray-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

            {/* Reviews Section for Mobile */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">User Reviews</h2>
              
              {reviewsLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600">Loading reviews...</span>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-base">📝 No reviews yet.</p>
                  <p className="text-gray-400 text-sm mt-2">Be the first to review this book!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={review._id || review.id || index} className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-[#D91C7D]">
                          {review.userId?.name || review.userName || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ⭐
                            </span>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.review}</p>
                      {review.createdAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex main min-h-screen pt-5 bg-white">
        {/* Left Sidebar - Book Cover */}
        <div className="left fixed top-0 w-1/4 bg-white h-[calc(100vh)]">
          {thumbnail && (
            <img
              src={thumbnail}
              alt={title}
              className="w-[80%] m-auto mt-20 rounded-r-3xl shadow-2xl shadow-gray-500 transition-transform duration-500 ease-in-out hover:scale-102 hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>

        {/* Right Content Area */}
        <div className="right ml-[25%] w-3/4 h-[calc(100vh-1rem)] overflow-y-auto pr-4 pl-5 pt-10">
          <div className="p-4">
            <h1 className='text-5xl font-bold text-[#D91C7D] w-5/6'>{title}</h1>
            <h2 className='leading-loose text-2xl text-gray-500'>{authors}</h2>
            
            <p className='mt-4 text-sm w-5/6 text-justify'>{description}</p>
            
            <div className='mt-6 w-5/6'>
              <div className='text-[#d91c7e] text-sm font-medium'>GENRES:</div>
              <div className='text-sm text-gray-500 font-semibold mt-2'>{categories}</div>
            </div>

            <div className='mt-4 text-xs text-gray-600'>
              {pageCount && <p>{pageCount} pages</p>}
              <p>First published on - {publishedDate}</p>
              {publisher && <p>Publisher - {publisher}</p>}
            </div>

            {/* Average Rating for Desktop */}
            {averageRating && (
              <div className="mt-6 w-5/6">
                <span className="font-semibold text-gray-700">Average Rating:</span>
                <span className="ml-2 text-yellow-500">⭐ {averageRating}/5</span>
                <span className="ml-2 text-gray-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

            {/* Reviews Section for Desktop */}
            <div className="mt-12 border-t pt-8 w-5/6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">User Reviews</h2>
              
              {reviewsLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600">Loading reviews...</span>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">📝 No reviews yet.</p>
                  <p className="text-gray-400 text-sm mt-2">Be the first to review this book!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={review._id || review.id || index} className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-[#D91C7D]">
                          {review.userId?.name || review.userName || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ⭐
                            </span>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.review}</p>
                      {review.createdAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail