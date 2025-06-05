import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Profile() {
    const { token, loading } = useContext(AuthContext);
    const [user, setUser] = useState(null);

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

    if (loading) return <p>Loading...</p>;
    if (!token) return <p>Please log in to view your profile.</p>;
    if (!user) return <p>Loading profile...</p>;

    return (

        <div className='pt-16 px-10'>
            <Navbar />
            

            {user.profilePic ? (
                <img
                    src={`http://localhost:5000${user.profilePic}`}
                    alt="Profile"
                    style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover' }}
                />

            ) : (
                <div
                    style={{
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        backgroundColor: '#ccc',
                        display: 'inline-block',
                        lineHeight: '150px',
                        color: '#666',
                    }}
                >
                    No Image
                </div>
            )}
            <h1 className='font-semibold text-3xl'>Welcome back <span className='font-bold text-[#d91c7d]'>{user.name}</span></h1>
            <p>your email is "{user.email}"</p>
        </div>
    );
}

export default Profile;
