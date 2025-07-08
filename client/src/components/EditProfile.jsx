import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
const VITE_API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

const EditProfile = ({ userData, closeModal, onProfileUpdate }) => {
  const { token } = useContext(AuthContext);

  const [name, setName] = useState(userData.name);
  const [bio, setBio] = useState(userData.bio || '');
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);

    if (profilePic) formData.append('profilePic', profilePic);

    try {
      setLoading(true);
      const res = await axios.patch(`${VITE_API_BASE_URL}/api/users/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      onProfileUpdate(res.data.user);
      closeModal();
    } catch (err) {
      alert('Error updating profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-[0_0_2rem] shadow-gray-600 border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4">
        <h3 className="text-xl font-bold text-[#d91c7d] uppercase text-center border-b-2">
          Edit Profile 
        </h3>
      </div>
      
      {/* Form Content */}
      <div className="px-6 py-2 space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-md font-semibold text-[#d91c7d] mb-1 underline">
            Name
          </label>
          <input
            className="w-full px-3 py-2 border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition text-sm"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Bio Field */}
        <div>
          <label className="block text-md font-semibold text-[#d91c7d] mb-1 underline">
            Bio
          </label>
          <textarea
            className="w-full px-3 py-2 border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition resize-none text-sm"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="3"
            maxLength={100}
            placeholder="Tell something about yourself..."
          />
          <div className="text-xs text-gray-500 mt-0 text-right">
            {bio.length}/100
          </div>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-md font-semibold text-[#d91c7d] mb-1 underline">
            Profile Picture
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
            <div className="border-2 border-dashed border-pink-300 rounded-lg p-3 text-center hover:border-pink-400 hover:bg-pink-50 transition cursor-pointer">
              {profilePic ? (
                <div className="text-pink-600 text-sm font-medium">
                  ✓ {profilePic.name}
                </div>
              ) : (
                <div className="text-pink-500 text-sm">
                  <div className="text-lg mb-1">📷</div>
                  <div>Choose photo</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            onClick={handleUpdate}
            className="flex-1 bg-pink-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-pink-700 transition disabled:opacity-50 text-sm"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>

          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2.5 text-pink-600 font-semibold border border-pink-300 rounded-lg hover:bg-pink-50 transition text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default EditProfile;
