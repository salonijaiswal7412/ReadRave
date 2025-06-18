import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import pfp from '../assets/images/pfp.png'
import EditProfile from '../components/EditProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function Profile() {
    const { token, loading } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [userReviews, setUserReviews] = useState([]);
    const [bookTitles, setBookTitles] = useState({});

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

        fetchProfile();
        fetchUserReviews();
    }, [token]);

    // New handler to update user locally after editing
    const handleProfileUpdate = (updatedUser) => {
        setUser(updatedUser);
        setShowEdit(false);
    };

    if (loading) return <p>Loading...</p>;
    if (!token) return <p>Please log in to view your profile.</p>;
    if (!user) return <p>Loading profile...</p>;

    return (
        <div className='pt-14 px-10 max-w-screen min-h-screen bg-white'>
            <Navbar />
            <div className="main w-full max-w-6xl mx-auto">
                {/* Profile Section */}
                <div className="profile bg-[#d91c7d] shadow-[0_0_2rem] shadow-gray-500 p-6 h-60 rounded-xl mb-8 flex">
                    <div className="p-dets flex-1 pr-6">
                        <h1 className='font-semibold text-3xl text-pink-300'>Welcome back ReadRaver,</h1>
                        <h1 className='text-5xl font-bold tracking-wide text-white uppercase mt-2'>{user.name}!</h1>

                        {user.bio ? (
                            <div className='text-pink-300 text-lg mt-4'>{user.bio}</div>
                        ) : (
                            <div className='text-pink-300 text-lg mt-4'>no bio yet</div>
                        )}

                        <button
                            onClick={() => setShowEdit(true)}
                            className="mt-4 px-4 py-2 bg-white text-[#d91c7d] font-bold rounded-full shadow-[0_0_0.3rem] shadow-gray-300 hover:font-bold hover:shadow-[0_0_0.7rem] hover:shadow-gray-800 transition  uppercase duration-300"
                        >
                            Edit Profile
                        </button>

                        {showEdit && (
                            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                                <div className="bg-[rgb(255,255,255)] p-6 rounded-lg w-full max-w-md shadow-2xl">
                                    <EditProfile
                                        userData={user}
                                        closeModal={() => setShowEdit(false)}
                                        onProfileUpdate={handleProfileUpdate}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-pic flex-shrink-0">
                        {user.profilePic ? (
                            <img
                                src={`http://localhost:5000${user.profilePic}`}
                                alt="Profile"
                                className='w-40 h-40 rounded-full shadow-[0_0_1rem] shadow-gray-800 object-cover'
                            />
                        ) : (
                            <img
                                src={pfp}
                                alt="Profile"
                                className='w-40 h-40 rounded-full shadow-[0_0_1rem] shadow-gray-800 object-cover'
                            />
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section bg-pink-50 rounded-xl shadow-[0_0_1rem] shadow-gray-300 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-[#D91C7D]">My Reviews</h2>
                        <div className="text-sm text-gray-600">
                            {userReviews.length} {userReviews.length === 1 ? 'review' : 'reviews'}
                        </div>
                    </div>

                    {userReviews.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-3">📚</div>
                            <p className="text-gray-600">You haven't written any reviews yet.</p>
                            <p className="text-gray-500 text-sm mt-1">Start reading and sharing your thoughts!</p>
                        </div>
                    ) : (
                        <div className="reviews-container overflow-x-auto pb-2">
                            <div className="flex gap-4 min-w-max">
                                {userReviews.map((rev) => (
                                    <div key={rev._id} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-1 hover:border-[#d91c7d] transition-shadow flex-shrink-0 w-80 h-48 flex flex-col">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[#d91c7d] underline font-semibold text-base flex items-start">
                                                    <span className="text-xl  flex-shrink-0"></span>
                                                    <span className="truncate">
                                                        {bookTitles[rev.bookId] || 'Loading...'}
                                                    </span>
                                                </h3>
                                                <div className="flex items-center mt-2">
                                                    <div className="flex text-sm">
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

                                        <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3 flex-1 overflow-hidden">
                                            {rev.review}
                                        </p>

                                        <div className="flex gap-3 pt-2 border-t border-gray-100 mt-auto">
                                            <button className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                                                 Edit
                                            </button>
                                            <button className="text-xs text-red-600 hover:text-red-800 hover:underline transition-colors ">
                                                 Delete
                                            </button>
                                        </div>
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