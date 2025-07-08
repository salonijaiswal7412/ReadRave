import React, { useState, useContext,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
const VITE_API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

import AuthContext from '../context/AuthContext';

const ReviewForm = ({ bookId, onReviewSubmitted, user }) => {
   

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    
    const { getValidToken, logout } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (review.trim() === '') {
            setError('Please write a review');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Get valid token from AuthContext
            const token = getValidToken();
            
            if (!token) {
                setError('Please log in to submit a review');
                return;
            }

            

            const response = await fetch(`${VITE_API_BASE_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookId,
                    rating,
                    review,
                })
            });

            if (response.ok) {
                
                setReviewSubmitted(true);
                onReviewSubmitted();
                
                // Clear any previous errors
                setError('');
            } else {
                const errData = await response.json();
                console.log('Backend error:', errData);
                
                // Handle specific error cases
                if (response.status === 401) {
                    // Token is invalid/expired, logout user
                    logout();
                    setError('Your session has expired. Please log in again.');
                } else {
                    setError(errData.error || errData.message || 'Failed to submit review. Please try again.');
                }
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [error]);

    // If review has been submitted, show success message
    if (reviewSubmitted) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <div>
                        <h3 className="text-lg font-semibold text-green-800">Review Successfully Added!</h3>
                        <p className="text-green-700">Thank you for sharing your thoughts about this book.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border-gray-100 border-2 rounded-lg p-6 mb-6 shadow-[0_0_1.5rem] shadow-gray-300 ">
            <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#D91C7D] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {user?.user?.name.charAt(0)?.toUpperCase() || user?.user?.name.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                
                    <p className="font- text-gray-600">
                        Writing as<span className='font-bold text-[#d91c7edf] '> {user?.user?.name || user?.user?.email || 'User'}</span>
                    </p>
                    <p className="text-sm text-gray-500">Share your thoughts about this book</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Selection */}
                <div>
                    <label className="block text-md font-medium text-gray-700 mb-2">
                        Your Rating <span className='text-red-500'>*</span>
                    </label>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                
                                onMouseEnter={()=>setRating(star)}
                                className={` cursor-pointer text-2xl ${star<= rating ? 'text-[#d91c7d]' : 'text-gray-300'} hover:text-[#d91c7d] transition-colors `}
                                disabled={isSubmitting}
                            >
                                <FontAwesomeIcon icon={faStar} />

                            </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                            {rating > 0 && `${rating}/5`}
                        </span>
                    </div>
                </div>

                {/* Review Text */}
                <div>
                    <label className="block text-md font-medium text-gray-700 mb-2">
                        Your Review  <span className='text-red-500'>*</span>
                    </label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="What did you think about this book?"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D91C7D] focus:border-transparent resize-none "
                        rows="4"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded flex items-start">
                        <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0 || review.trim() === ''}
                    className="px-6 py-2 bg-[#D91C7D] text-white rounded-md hover:bg-[#b8165a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </span>
                    ) : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;