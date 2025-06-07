import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import pfp from '../assets/images/pfp.png'
import EditProfile from '../components/EditProfile';

function Profile() {
    const { token, loading } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [showEdit, setShowEdit] = useState(false);

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

        fetchProfile();
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
        <div className='pt-14 px-10 w-screen min-h-screen bg-white'>
            <Navbar />
            <div className="main flex w-full ">
                <div className="left w-3/5 ">
                    <div className="profile bg-[#d91c7d] shadow-[0_0_2rem] shadow-gray-500 p-4 h-60 rounded-xl m-4 flex">
                        <div className="p-dets w-[65%]">
                            <h1 className='font-semibold text-3xl text-pink-300'>Welcome back ReadRaver,</h1>
                            <h1 className='text-5xl font-bold tracking-wide text-white uppercase mt-2'>{user.name}!</h1>

                            {user.bio ? (
                                <div className='text-pink-300 text-lg mt-4'>{user.bio}</div>
                            ) : (
                                <div>no bio yet</div>
                            )}

                            <button
                                onClick={() => setShowEdit(true)}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Edit Profile
                            </button>

                            {showEdit && (
                                <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
                                    <div className="bg-[rgb(255,255,255)] p-6 rounded-lg w-full max-w-md shadow-2xl ">
                                        <EditProfile
                                            userData={user}
                                            closeModal={() => setShowEdit(false)}
                                            onProfileUpdate={handleProfileUpdate}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-pic">
                            {user.profilePic ? (
                                <img
                                    src={`http://localhost:5000${user.profilePic}`}
                                    alt="Profile"
                                    className='w-50 h-50 rounded-full shadow-[0_0_1rem] shadow-gray-100 '
                                />
                            ) : (
                                <img
                                    src={pfp}
                                    alt="Profile"
                                    className='w-50 h-50 rounded-full shadow-[0_0_1rem] shadow-gray-100 '
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="right w-2/5 bg-pink-300"></div>
            </div>
        </div>
    );
}

export default Profile;
