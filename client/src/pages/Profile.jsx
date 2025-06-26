import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import pfp from '../assets/images/pfp.png'
import EditProfile from '../components/EditProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

// Toast Component
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    return (
        <div className={`fixed top-20 right-4 ${bgColor} text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 ease-in-out max-w-xs sm:max-w-sm`}>
            <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-2 sm:ml-4 text-white hover:text-gray-200 font-bold text-lg leading-none"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

function Profile() {
    const { token, loading } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [userReviews, setUserReviews] = useState([]);
    const [bookTitles, setBookTitles] = useState({});
    const [editingReview, setEditingReview] = useState(null);
    const [editFormData, setEditFormData] = useState({ rating: 0, review: '' });
    const [toast, setToast] = useState(null);

    const [shelfStats, setSelfStats] = useState({
        wantToRead: 0,
        currentlyReading: 0,
        finishedReading: 0
    });

    // Toast helper function
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;

            try {
                const res = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(res.data.user);
            } catch (error) {
                console.error('Failed to fetch profile:', error.message);
            }
        };

        const fetchUserReviews = async () => {
            if (!token) return;

            try {
                const res = await axios.get("http://localhost:5000/api/reviews/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Fetched user reviews:', res.data);
                setUserReviews(res.data);

                // Fetch book titles for all reviews
                const bookIds = res.data.map(review => review.bookId);
                fetchBookTitles(bookIds);
            } catch (err) {
                console.error('Error fetching user reviews: ', err.message);
                console.error('Full error:', err.response?.data || err);
            }
        };

        const fetchBookTitles = async (bookIds) => {
            const titles = {};

            for (const bookId of bookIds) {
                try {
                    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
                    titles[bookId] = response.data.volumeInfo?.title || 'Unknown Title';
                } catch (error) {
                    console.error(`Error fetching book title for ${bookId}:`, error);
                    titles[bookId] = 'Unknown Title';
                }
            }

            setBookTitles(titles);
        };

        const fetchShelf = async () => {
            if (!token) return;

            try {
                const res = await axios.get("http://localhost:5000/api/reading-list", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const stats = {
                    wantToRead: 0,
                    currentlyReading: 0,
                    finishedReading: 0
                };

                res.data.forEach((item) => {
                    if (stats[item.status] != undefined) {
                        stats[item.status]++;
                    }
                });

                setSelfStats(stats);
            }
            catch (err) {
                console.error("error fetching reading list:", err.message);
            }
        };

        fetchProfile();
        fetchUserReviews();
        fetchShelf();
    }, [token]);

    // Handler to update user locally after editing profile
    const handleProfileUpdate = (updatedUser) => {
        setUser(updatedUser);
        setShowEdit(false);
    };

    // Handler for deleting a review
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove the deleted review from the state
            setUserReviews(userReviews.filter(review => review._id !== reviewId));
            showToast('Review deleted successfully!', 'success');
        } catch (error) {
            console.error('Failed to delete review:', error);
            showToast('Failed to delete review. Please try again.', 'error');
        }
    };

    // Handler for starting to edit a review
    const handleEditReview = (review) => {
        setEditingReview(review._id);
        setEditFormData({
            rating: review.rating,
            review: review.review
        });
    };

    // Handler for updating a review
    const handleUpdateReview = async (e) => {
        e.preventDefault();

        if (!editFormData.rating || !editFormData.review.trim()) {
            showToast('Please provide both rating and review text.', 'error');
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/reviews/${editingReview}`,
                {
                    rating: editFormData.rating,
                    review: editFormData.review
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update the review in the local state
            setUserReviews(userReviews.map(review =>
                review._id === editingReview
                    ? { ...review, rating: editFormData.rating, review: editFormData.review }
                    : review
            ));

            // Reset editing state
            setEditingReview(null);
            setEditFormData({ rating: 0, review: '' });
            showToast('Review updated successfully!', 'success');
        } catch (error) {
            console.error('Failed to update review:', error);
            showToast('Failed to update review. Please try again.', 'error');
        }
    };

    // Handler for canceling edit
    const handleCancelEdit = () => {
        setEditingReview(null);
        setEditFormData({ rating: 0, review: '' });
    };

    if (loading) return <p>Loading...</p>;
    if (!token) return <p>Please log in to view your profile.</p>;
    if (!user) return <p>Loading profile...</p>;

    return (
        <div className='pt-14 px-4 sm:px-6 md:px-8 lg:px-10 max-w-screen min-h-screen bg-white'>
            <Navbar />

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <div className="main w-full max-w-6xl mx-auto">
                {/* Profile Section */}
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
                    <div className="profile bg-[#d91c7d] shadow-[0_0_2rem] shadow-gray-500 p-4 sm:p-6 h-auto lg:h-60 rounded-xl mb-4 lg:mb-8 flex flex-col sm:flex-row w-full lg:w-4/6">
                        <div className="p-dets flex-1 pr-0 sm:pr-6 mb-4 sm:mb-0">
                            <h1 className='font-semibold text-xl sm:text-2xl lg:text-3xl text-pink-300'>Welcome back ReadRaver,</h1>
                            <h1 className='text-2xl sm:text-3xl lg:text-5xl font-bold tracking-wide text-white uppercase mt-2'>{user.name}!</h1>

                            {user.bio ? (
                                <div className='text-pink-300 text-sm sm:text-base lg:text-lg mt-2 lg:mt-4'>{user.bio}</div>
                            ) : (
                                <div className='text-pink-300 text-sm sm:text-base lg:text-lg mt-2 lg:mt-4'>no bio yet</div>
                            )}

                            <button
                                onClick={() => setShowEdit(true)}
                                className="mt-2 lg:mt-4 px-3 py-1 sm:px-4 sm:py-2 bg-white text-[#d91c7d] text-sm sm:text-base font-bold rounded-full shadow-[0_0_0.3rem] shadow-gray-300 hover:font-bold hover:shadow-[0_0_0.7rem] hover:shadow-gray-800 transition uppercase duration-300"
                            >
                                Edit Profile
                            </button>

                            {showEdit && (
                                <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                                    <div className="bg-[rgb(255,255,255)] p-4 sm:p-6 rounded-lg w-full max-w-md shadow-2xl">
                                        <EditProfile
                                            userData={user}
                                            closeModal={() => setShowEdit(false)}
                                            onProfileUpdate={handleProfileUpdate}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-pic flex-shrink-0 flex justify-center sm:justify-end">
                            {user.profilePic ? (
                                <img
                                    src={`http://localhost:5000${user.profilePic}`}
                                    alt="Profile"
                                    className='w-32 h-32 sm:w-40 sm:h-40 lg:w-50 lg:h-50 rounded-full shadow-[0_0_1rem] shadow-gray-800 object-cover'
                                />
                            ) : (
                                <img
                                    src={pfp}
                                    alt="Profile"
                                    className='w-32 h-32 sm:w-40 sm:h-40 rounded-full shadow-[0_0_1rem] shadow-gray-800 object-cover'
                                />
                            )}
                        </div>
                    </div>
                    
                    <div className="shelf w-full lg:w-2/6 mx-0 lg:mx-4 p-4 shadow-[0_0_2rem] shadow-gray-500 h-auto lg:h-60 rounded-xl mb-4 lg:mb-0">
                        <h1 className='text-[#d91c7d] font-bold tracking-wide uppercase text-center text-lg sm:text-xl lg:text-2xl  lg:my-0'>Rave Report</h1>

                        <div className="flex flex-col gap-2 lg:gap-3 text-sm mt-2 lg:mt-4 text-gray-700 mx-2 sm:mx-4 lg:mx-6 mb-4">
                            <div className="flex justify-between text-base sm:text-lg font-semibold items-center opacity-85">
                                <span>📚 Want to Read</span>
                                <span className="text-[#d91c7d] font-bold">{shelfStats.wantToRead}</span>
                            </div>
                            <div className="flex justify-between text-base sm:text-lg font-semibold items-center opacity-85">
                                <span>📖 Currently Reading</span>
                                <span className="text-[#d91c7d] font-bold">{shelfStats.currentlyReading}</span>
                            </div>
                            <div className="flex justify-between text-base sm:text-lg font-semibold items-center opacity-85">
                                <span>✅ Finished Reading</span>
                                <span className="text-[#d91c7d] font-bold">{shelfStats.finishedReading}</span>
                            </div>
                        </div>
                      
                          <Link to="/my-shelf" className="w-full text-[#d91c7d] hover:text-pink-700 hover:underline mx-28 text-md font-semibold  tracking-wide "> View Full Shelf </Link>
                    

                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section bg-pink-50 rounded-xl shadow-[0_0_1rem] shadow-gray-300 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#D91C7D]">My Reviews</h2>
                        <div className="text-sm text-gray-600">
                            {userReviews.length} {userReviews.length === 1 ? 'review' : 'reviews'}
                        </div>
                    </div>

                    {userReviews.length === 0 ? (
                        <div className="text-center py-6 sm:py-8">
                            <div className="text-3xl sm:text-4xl mb-3">📚</div>
                            <p className="text-gray-600 text-sm sm:text-base">You haven't written any reviews yet.</p>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1">Start reading and sharing your thoughts!</p>
                        </div>
                    ) : (
                        <div className="reviews-container overflow-x-auto pb-2">
                            <div className="flex gap-3 sm:gap-4 min-w-max">
                                {userReviews.map((rev) => (
                                    <div key={rev._id} className={`bg-white p-3 sm:p-4 border border-gray-200 rounded-lg shadow-[0_0_.7rem] shadow-gray-200 hover:border-1 hover:shadow-[0_0_.5rem] hover:shadow-gray-400 transition-shadow flex-shrink-0 flex flex-col w-72 sm:w-80`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[#d91c7d] underline font-semibold text-sm sm:text-base flex items-start">
                                                    <span className="text-lg sm:text-xl flex-shrink-0"></span>
                                                    <span className="truncate">
                                                        <Link to={`/book/${rev.bookId}`} className="hover:underline text-[#D91C7D]">
                                                            {bookTitles[rev.bookId] || 'Loading...'}
                                                        </Link>
                                                    </span>
                                                </h3>
                                                <div className="flex items-center mt-2">
                                                    <div className="flex text-xs sm:text-sm">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className={i < rev.rating ? "text-[#d91c7d]" : "text-gray-300"}>
                                                                <FontAwesomeIcon icon={faStar} />
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <span className="ml-2 text-xs text-gray-600">
                                                        {rev.rating}/5
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                                {new Date(rev.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>

                                        {editingReview === rev._id ? (
                                            // Edit Form
                                            <form onSubmit={handleUpdateReview} className="flex-1 flex flex-col">
                                                <div className="mb-3">
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Rating
                                                    </label>
                                                    <select
                                                        value={editFormData.rating}
                                                        onChange={(e) => setEditFormData({ ...editFormData, rating: parseInt(e.target.value) })}
                                                        className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-[#d91c7d] focus:border-transparent"
                                                        required
                                                    >
                                                        <option value={0}>Select Rating</option>
                                                        <option value={1}>1 Star</option>
                                                        <option value={2}>2 Stars</option>
                                                        <option value={3}>3 Stars</option>
                                                        <option value={4}>4 Stars</option>
                                                        <option value={5}>5 Stars</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3 flex-1">
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Review
                                                    </label>
                                                    <textarea
                                                        value={editFormData.review}
                                                        onChange={(e) => setEditFormData({ ...editFormData, review: e.target.value })}
                                                        className="w-full p-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-[#d91c7d] focus:border-transparent resize-none flex-1"
                                                        rows="5"
                                                        placeholder="Write your review..."
                                                        required
                                                    />
                                                </div>
                                                <div className="flex gap-2 pt-2 border-t border-gray-100 mt-auto">
                                                    <button
                                                        type="submit"
                                                        className="text-xs bg-[#d91c7d] text-white px-3 py-1 rounded hover:bg-[#b91c5c] transition-colors"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelEdit}
                                                        className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            // Display Mode
                                            <>
                                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-3 flex-1 overflow-hidden">
                                                    {rev.review}
                                                </p>

                                                <div className="flex gap-3 pt-2 border-t border-gray-100 mt-auto">
                                                    <button
                                                        onClick={() => handleEditReview(rev)}
                                                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReview(rev._id)}
                                                        className="text-xs text-red-600 hover:text-red-800 hover:underline transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <style jsx>{`
                        .reviews-container::-webkit-scrollbar {
                            height: 4px;
                        }
                        .reviews-container::-webkit-scrollbar-track {
                            background: #f1f1f1;
                            border-radius: 4px;
                        }
                        .reviews-container::-webkit-scrollbar-thumb {
                            background: #D91C7D;
                            border-radius: 4px;
                        }
                        .reviews-container::-webkit-scrollbar-thumb:hover {
                            background: #B91C5C;
                        }
                        .line-clamp-3 {
                            display: -webkit-box;
                            -webkit-line-clamp: 3;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }
                    `}</style>
                </div>
            </div>
        </div>
    );
}

export default Profile;