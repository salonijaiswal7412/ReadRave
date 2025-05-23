import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    console.log('Component mounted, id:', id);
    
    if (!id) {
      setError('No book ID provided');
      setLoading(false);
      return;
    }

    // Fetch book data
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Book data:', data);
        setBook(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(`Failed to load book: ${err.message}`);
        setLoading(false);
      });

    // Fetch reviews
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await fetch(`/api/reviews/${id}`);
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
  }, [id]);

  console.log('Rendering - book:', !!book, 'loading:', loading, 'error:', error);

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 mb-4 text-lg font-semibold">⚠️ {error}</div>
        <div className="text-sm text-gray-500">Book ID: {id}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Loading book details...</span>
        </div>
        <div className="text-sm text-gray-500 mt-2">Book ID: {id}</div>
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

  // Safe rendering with fallbacks
  const title = book.volumeInfo?.title || 'Unknown Title';
  const authors = book.volumeInfo?.authors?.join(', ') || 'Unknown Author';
  const publishedDate = book.volumeInfo?.publishedDate || 'Unknown';
  const pageCount = book.volumeInfo?.pageCount;
  const categories = book.volumeInfo?.categories?.join(', ');
  const publisher = book.volumeInfo?.publisher;
  
  // Clean HTML tags from description
  const cleanDescription = (desc) => {
    if (!desc) return 'No description available';
    return desc.replace(/<[^>]*>/g, '').slice(0, 500);
  };
  const description = cleanDescription(book.volumeInfo?.description);
  const thumbnail = book.volumeInfo?.imageLinks?.thumbnail;

  // Calculate average rating from reviews
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Book Details Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {thumbnail && (
          <div className="flex-shrink-0">
            <img 
              src={thumbnail.replace('http://', 'https://')} // Force HTTPS
              alt={title} 
              className="w-48 h-auto rounded-lg shadow-md" 
              onError={(e) => {
                console.log('Image failed to load:', thumbnail);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {authors}</p>
          
          {/* Book Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            {publisher && (
              <div>
                <span className="font-semibold text-gray-700">Publisher:</span>
                <span className="ml-2 text-gray-600">{publisher}</span>
              </div>
            )}
            <div>
              <span className="font-semibold text-gray-700">Published:</span>
              <span className="ml-2 text-gray-600">{publishedDate}</span>
            </div>
            {pageCount && (
              <div>
                <span className="font-semibold text-gray-700">Pages:</span>
                <span className="ml-2 text-gray-600">{pageCount}</span>
              </div>
            )}
            {categories && (
              <div>
                <span className="font-semibold text-gray-700">Genre:</span>
                <span className="ml-2 text-gray-600">{categories}</span>
              </div>
            )}
          </div>

          {/* Average Rating */}
          {averageRating && (
            <div className="mb-4">
              <span className="font-semibold text-gray-700">Average Rating:</span>
              <span className="ml-2 text-yellow-500">⭐ {averageRating}/5</span>
              <span className="ml-2 text-gray-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}
          
          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {description}
              {book.volumeInfo?.description && book.volumeInfo.description.length > 500 && '...'}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
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
  )
}

export default BookDetail