import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import AuthContext from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheck, faExclamationTriangle,faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import CommonFooter from '../components/CommonFooter';

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? faCheck : faExclamationTriangle;

  return (
    <div className={`fixed top-20 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in-right`}>
      <FontAwesomeIcon icon={icon} />
      <span className="font-medium">{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 font-bold text-lg"
      >
        ×
      </button>
    </div>
  );
};

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Use AuthContext instead of localStorage directly
  const { isAuthenticated, user, loading: authLoading } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  
  // Individual loading states for each shelf button
  const [shelfLoadingStates, setShelfLoadingStates] = useState({
    wantToRead: false,
    currentlyReading: false,
    finishedReading: false
  });

  // Toast state
  const [toast, setToast] = useState(null);

  // Get token from localStorage or context
  const token = localStorage.getItem('token');

  // Show toast function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Debug logs
  useEffect(() => {
    console.log('BookDetail - Auth state:', {
      isAuthenticated,
      user,
      authLoading,
      localStorage: {
        token: localStorage.getItem('token'),
        userData: localStorage.getItem('userData')
      }
    });
  }, [isAuthenticated, user, authLoading]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close modal when clicking anywhere on the screen
      if (selectedReview) {
        setSelectedReview(null);
      }
    };

    if (selectedReview) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedReview]);

  //check favourites
   const checkFavourite = async () => {
    if (!isAuthenticated || !token || !user) {
      setIsFav(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.user && res.data.user.favourites) {
        const fav = res.data.user.favourites.some(
          (fav) => fav.googleBookId === id
        );
        setIsFav(fav);
      }
    } catch (err) {
      console.error('Error checking favourites:', err);
      setIsFav(false);
    }
  };

  // Fetch reviews function
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

  useEffect(() => {
    console.log('component mounted, id:', id);
    if (!id) {
      setError('no book id available');
      setLoading(false);
      return;
    }

    // Fetch book data
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`Http error|${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Book data:', data);
        setBook(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('fetch error:', err);
        setError(`failed to load book: ${err.message}`);
        setLoading(false);
      });

    // Fetch reviews
    fetchReviews();
    
  }, [id]);

   // Check favorites when authentication state changes
  useEffect(() => {
    if (!authLoading) {
      checkFavourite();
    }
  }, [isAuthenticated, user, authLoading, id]);

  // Updated handleAddToShelf function with individual loading states
  const handleAddToShelf = async (status) => {
    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      showToast('Please login to add books to your shelf', 'error');
      handleLoginRedirect();
      return;
    }

    try {
      // Set loading state for specific button
      setShelfLoadingStates(prev => ({ ...prev, [status]: true }));
      console.log('Adding to shelf:', { googleBookId: id, status, token: token ? 'exists' : 'missing' });

      const response = await axios.post("http://localhost:5000/api/reading-list", {
        googleBookId: id,
        status
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Add to shelf response:', response.data);
      
      // Format status for display (convert camelCase to readable text)
      const statusDisplay = status.replace(/([A-Z])/g, ' $1').toLowerCase();
      showToast(`Book added to "${statusDisplay}" shelf!`, 'success');
      
    } catch (err) {
      console.error("Error adding to shelf:", err);
      
      if (err.response?.status === 409) {
        showToast("This book is already in your shelf!", 'error');
      } else if (err.response?.status === 401) {
        showToast("Authentication failed. Please login again.", 'error');
        handleLoginRedirect();
      } else if (err.response?.data?.error) {
        showToast(`Error: ${err.response.data.error}`, 'error');
      } else {
        console.error("Full error:", err.response || err.message);
        showToast("Failed to add book to shelf. Please try again.", 'error');
      }
    } finally {
      // Clear loading state for specific button
      setShelfLoadingStates(prev => ({ ...prev, [status]: false }));
    }
  };

  const handleToggleFavourite = async () => {
    if (!isAuthenticated || !token) {
      showToast('Please login to manage favourites', 'error');
      handleLoginRedirect();
      return;
    }

    if (!book) {
      showToast('Book data not loaded', 'error');
      return;
    }

    setFavLoading(true);

    try {
      const title = book.volumeInfo?.title || 'Unknown Title';
      const authors = book.volumeInfo?.authors?.join(', ') || 'Unknown Author';
      const thumbnail = book.volumeInfo?.imageLinks?.thumbnail || '';
      const cleanDescription = (desc) => {
        if (!desc) return 'No description available';
        return desc.replace(/<[^>]*>/g, '');
      };
      const description = cleanDescription(book.volumeInfo?.description);

      if (isFav) {
        // Remove from favourites
        await axios.delete(`http://localhost:5000/api/users/favourites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast('Removed from favourites', 'success');
        setIsFav(false);
      } else {
        // Add to favourites
        await axios.post(
          'http://localhost:5000/api/users/favourites',
          {
            userId: user._id,
            book: {
              googleBookId: id,
              title: title,
              author: authors,
              thumbnail: thumbnail,
              description: description,
            },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showToast('Added to favourites', 'success');
        setIsFav(true);
      }
    } catch (err) {
      console.error('Favourite toggle error:', err);
      if (err.response?.data?.message) {
        showToast(err.response.data.message, 'error');
      } else {
        showToast('Failed to update favourites', 'error');
      }
    } finally {
      setFavLoading(false);
    }
  };


  // Handle review submission callback
  const handleReviewSubmitted = () => {
    fetchReviews(); // Refresh reviews after submission
  };

  // Handle login redirect with return URL
  const handleLoginRedirect = () => {
    console.log('Storing redirect URL:', `/book/${id}`);
    // Store current page URL for redirect after login
    const currentPath = `/book/${id}`;
    localStorage.setItem('redirectAfterLogin', currentPath);
    navigate('/login');
  };

  // Handle review click
  const handleReviewClick = (review, event) => {
    event.stopPropagation(); // Prevent event bubbling
    setSelectedReview(review);
  };

  // Function to truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

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
  if (loading || authLoading) {
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

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Click Modal for Review Details */}
      {selectedReview && (
        <div
          className={`fixed z-50 bg-white shadow-[0_0_2rem] shadow-gray-500 rounded-xl transform transition-all duration-300 ease-in-out
            ${selectedReview.review && selectedReview.review.length > 500
              ? 'top-[10%] left-[10%] right-[10%] bottom-[10%] overflow-y-auto'
              : selectedReview.review && selectedReview.review.length > 200
                ? 'top-[20%] left-[15%] right-[15%] max-h-[60%]  '
                : 'top-[30%] left-[20%] right-[20%] max-h-[50%]'
            }
            md:${selectedReview.review && selectedReview.review.length > 500
              ? 'left-[27%] right-[5%] top-[10%] bottom-[10%]'
              : selectedReview.review && selectedReview.review.length > 200
                ? 'left-[30%] right-[10%] top-[20%] max-h-[60%]'
                : 'left-[35%] right-[15%] top-[30%] max-h-[40%]'
            }`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4 flex-shrink-0">
              <h3 className="font-bold text-xl text-[#D91C7D] flex-1 pr-4">
                {selectedReview.userId?.name || selectedReview.userName || 'Anonymous'}
              </h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < selectedReview.rating ? 'text-[#d91c7d]' : 'text-gray-300'}>
                    <FontAwesomeIcon icon={faStar} />
                  </span>
                ))}
                <span className="ml-2 text-sm text-gray-600">({selectedReview.rating}/5)</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <p className="text-gray-700 leading-relaxed mb-4 text-justify">{selectedReview.review}</p>
            </div>
            {selectedReview.createdAt && (
              <p className="text-xs text-gray-400 flex-shrink-0 mt-2">
                Added on - {new Date(selectedReview.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-white ">
        <div className="flex"></div>
        <div className="p-4 pt-14">
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
          
          <div className="shelf flex flex-col text-center mt-4 ">
            <button 
              onClick={() => handleAddToShelf('wantToRead')} 
              disabled={shelfLoadingStates.wantToRead}
              className={`mx-auto w-40 font-semibold shadow-[0_0_.8rem] cursor-pointer shadow-gray-300 hover:shadow-gray-600 h-8 rounded-full text-white bg-[#d91c7d] ${shelfLoadingStates.wantToRead ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {shelfLoadingStates.wantToRead ? 'Adding...' : 'Want to read'}
            </button>
            <button 
              className={`mx-auto cursor-pointer w-40 font-semibold shadow-[0_0_.8rem] shadow-gray-300 h-8 rounded-full text-white mt-2 bg-[#d91c7d] hover:shadow-gray-600 ${shelfLoadingStates.currentlyReading ? 'opacity-50 cursor-not-allowed' : ''}`} 
              onClick={() => handleAddToShelf('currentlyReading')}
              disabled={shelfLoadingStates.currentlyReading}
            >
              {shelfLoadingStates.currentlyReading ? 'Adding...' : 'Currently Reading'}
            </button>
            <button 
              className={`cursor-pointer mx-auto w-40 font-semibold shadow-[0_0_.8rem] shadow-gray-300 h-8 mt-2 rounded-full text-white hover:shadow-gray-600 bg-[#d91c7d] ${shelfLoadingStates.finishedReading ? 'opacity-50 cursor-not-allowed' : ''}`}  
              onClick={() => handleAddToShelf('finishedReading')}
              disabled={shelfLoadingStates.finishedReading}
            >
              {shelfLoadingStates.finishedReading ? 'Adding...' : 'Finished Reading'}
            </button>
          </div>

          {/* Book Info for Mobile */}
          <div className="space-y-4 mt-4">
           <div className='flex flex-col justify-between items-center gap-4'>
              <h1 className='text-center text-3xl font-bold text-[#D91C7D] flex-1 pr-4'>{title}</h1>
              {/* Favorite Button for Mobile */}
              <div className="flex-shrink-0">
                <button 
                  onClick={handleToggleFavourite}
                  disabled={favLoading}
                  className={`${favLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FontAwesomeIcon
                    icon={isFav ? faHeart : faHeartRegular}
                    className={`text-2xl cursor-pointer transition duration-300 ${
                      isFav ? 'text-red-500' : 'text-[#d91c7d]'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <h2 className='text-xl text-gray-500 text-center '>{authors}</h2>

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
                <span className="font-semibold text-[#d91c7d] underline" >Average Rating</span>
                <span className="ml-2 text-gray-600"><FontAwesomeIcon icon={faStar} className='text-[#d91c7d] mx-1' />
                  {averageRating}/5</span>
                <span className="ml-2 text-gray-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

            {/* Review Form for Mobile */}
            <div className="mt-8 border-t pt-6">
              {isAuthenticated && user ? (
                <div>
                  <p className="text-green-600 mb-4">
                    Welcome back, {user.name || user.email}! You can write a review.
                  </p>
                  <ReviewForm
                    bookId={id}
                    onReviewSubmitted={handleReviewSubmitted}
                    user={user}
                  />
                </div>
              ) : (
                <div className="bg-gray-50 shadow-[0_0_1rem] shadow-gray-300 rounded-lg p-6 text-center mb-6">
                  <p className="text-gray-600 mb-3">Want to write a review?</p>
                  <button
                    onClick={handleLoginRedirect}
                    className="px-6 py-2 bg-[#D91C7D] text-white rounded-full hover:bg-[#b8165a] transition-colors duration-200"
                  >
                    LOGIN
                  </button>
                </div>
              )}

              {/* Reviews Section for Mobile */}
              <h2 className="text-2xl font-bold text-[#d91c7d] mb-4 m-4">User Reviews</h2>

              {reviewsLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600">Loading reviews...</span>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-base">No reviews yet.</p>
                  <p className="text-gray-400 text-sm mt-2">Be the first to review this book!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {reviews.map((review, index) => (
                    <div
                      key={review._id || review.id || index}
                      className="bg-gray-50 shadow-[0_0_1rem] shadow-gray-300 rounded-lg p-4 h-40 cursor-pointer transition-all duration-500 hover:shadow-gray-500 hover:shadow-[0_0_1rem]"
                      onClick={(e) => handleReviewClick(review, e)}
                    >
                      <div className="items-center justify-between mb-2">
                        <p className="font-semibold text-lg underline text-[#D91C7D] truncate">
                          {review.userId?.name || review.userName || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-0">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-[#d91c7d]' : 'text-gray-400'}>
                              <FontAwesomeIcon icon={faStar} className="text-xs" />
                            </span>
                          ))}
                          <span className='ml-2 text-sm text-gray-600'>({review.rating}/5)</span>
                        </div>
                      </div>
                      <p className="text-gray-800 leading-relaxed mt-4 mb-2 text-sm">
                        {truncateText(review.review, 40)}
                      </p>
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
              className="w-[75%] m-auto mt-16 rounded-r-3xl shadow-2xl shadow-gray-500 transition-transform duration-500 ease-in-out "
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div className="shelf flex flex-col text-center mt-4 ">
            <button 
              onClick={() => handleAddToShelf('wantToRead')} 
              disabled={shelfLoadingStates.wantToRead}
              className={`mx-auto w-40 font-semibold shadow-[0_0_.8rem] cursor-pointer shadow-gray-300 hover:shadow-gray-600 h-8 rounded-full text-white bg-[#d91c7d] ${shelfLoadingStates.wantToRead ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {shelfLoadingStates.wantToRead ? 'Adding...' : 'Want to read'}
            </button>
            <button 
              className={`mx-auto cursor-pointer w-40 font-semibold shadow-[0_0_.8rem] shadow-gray-300 h-8 rounded-full text-white mt-2 bg-[#d91c7d] hover:shadow-gray-600 ${shelfLoadingStates.currentlyReading ? 'opacity-50 cursor-not-allowed' : ''}`}    
              onClick={() => handleAddToShelf('currentlyReading')}
              disabled={shelfLoadingStates.currentlyReading}
            >
              {shelfLoadingStates.currentlyReading ? 'Adding...' : 'Currently Reading'}
            </button>
            <button 
              className={`cursor-pointer mx-auto w-40 font-semibold shadow-[0_0_.8rem] shadow-gray-300 h-8 mt-2 rounded-full text-white hover:shadow-gray-600 bg-[#d91c7d] ${shelfLoadingStates.finishedReading ? 'opacity-50 cursor-not-allowed' : ''}`}  
              onClick={() => handleAddToShelf('finishedReading')}
              disabled={shelfLoadingStates.finishedReading}
            >
              {shelfLoadingStates.finishedReading ? 'Adding...' : 'Finished Reading'}
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="right ml-[25%] w-3/4 h-[calc(100vh-1rem)] overflow-y-auto pr-4 pl-5 pt-10">
          <div className="p-4">
             <div className='flex justify-between'>
              <h1 className='text-5xl font-bold text-[#D91C7D] w-5/6'>{title}</h1>
              <div className=" ">
                <button 
                  onClick={handleToggleFavourite}
                  disabled={favLoading}
                  className={`${favLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FontAwesomeIcon
                    icon={isFav ? faHeart : faHeartRegular}
                    className={`text-3xl cursor-pointer transition duration-300 ${
                      isFav ? 'text-red-500' : 'text-[#d91c7d]'
                    }`}
                  />
                </button>
              </div>
            </div>

              
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
              <div className="mt-4">
                <span className="font-semibold text-[#d91c7d] underline">Average Rating</span>
                <span className="ml-2 text-gray-600"><FontAwesomeIcon icon={faStar} className='text-[#d91c7d] mx-1' />
                  {averageRating}/5</span>
                <span className="ml-2 text-gray-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

            {/* Review Form for Desktop */}
            <div className="mt-12 border-[#f13a98ae] border-t-1 pt-8 w-5/6">
              {isAuthenticated && user ? (
                <div>
                  <p className="text-[#d91c7ec9] font-semibold tracking-wide mb-4">
                    Welcome back, {user.name || user.email}! You can write a review.
                  </p>
                  <ReviewForm
                    bookId={id}
                    onReviewSubmitted={handleReviewSubmitted}
                    user={user}
                  />
                </div>
              ) : (
                <div className="bg-gray-50 shadow-[0_0_1.5rem] shadow-gray-300 rounded-lg p-6 text-center mb-6 w-1/2 m-auto">
                  <p className="text-gray-600 mb-3 text-lg">Want to write a review?</p>
                  <button
                    onClick={handleLoginRedirect}
                    className="px-6 py-2 bg-[#D91C7D] tracking-wider text-white text-md font-bold rounded-full hover:bg-[#b8165a] transition-colors duration-200"
                  >
                    LOG IN
                  </button>
                </div>
              )}

              {/* Reviews Section for Desktop */}
              <h2 className="text-3xl font-bold text-[#d91c7d] mb-6 tracking-wide">User Reviews</h2>

              {reviewsLoading ? (
                <div className="flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600">Loading reviews...</span>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 shadow-[0_0_1.5rem] shadow-gray-300 rounded-xl">
                  <p className="text-[#d91c7d] tracking-wide text-2xl"> No reviews yet.</p>
                  <p className="text-gray-400 text-sm mt-2">Be the first to review this book!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reviews.map((review, index) => (
                    <div
                      key={review._id || review.id || index}
                      className="bg-gray-50 shadow-[0_0_1rem] shadow-gray-300 rounded-lg p-4 h-40 cursor-pointer transition-all duration-300 hover:shadow-gray-500 hover:shadow-[0_0_1rem]"
                      onClick={(e) => handleReviewClick(review, e)}
                    >
                      <div className="items-center justify-between mb-2">
                        <p className="font-semibold text-lg text-[#D91C7D] truncate">
                          {review.userId?.name || review.userName || 'Anonymous'}
                        </p>
                       <div className="flex items-center gap-0">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-[#d91c7d]' : 'text-gray-400'}>
                              <FontAwesomeIcon icon={faStar} className="text-xs" />
                            </span>
                          ))}
                          <span className='ml-2 text-sm text-gray-600'>({review.rating}/5)</span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mt-4 mb-2 text-sm">
                        {truncateText(review.review, 50)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
       
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
      
    </div>
  );
};

export default BookDetail;