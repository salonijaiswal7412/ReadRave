import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast from 'react-hot-toast';
import logo from '../assets/images/logo.png';
import pfp from '../assets/images/pfp.png';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const { isAuthenticated, logout, token } = useContext(AuthContext);

  const navigate = useNavigate();
  
  function handleLogout(){
    logout();
    toast.success('Logged out successfully!', {
      position: 'top-right',
      style: {
        background: '#10B981',
        color: 'white',
        marginTop: '3rem',
      },
      iconTheme: {
        primary: 'white',
        secondary: '#10B981',
      },
    });
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Fetch user profile data when authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token || !isAuthenticated) {
        setUser(null);
        return;
      }

      try {
        const res = await axios.get(`${VITE_API_BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error('Failed to fetch user profile:', error.message);
        setUser(null);
      }
    };

    fetchUserProfile();
  }, [token, isAuthenticated]);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetch(`${VITE_API_BASE_URL}/api/google-books?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.slice(0, 5)); // Only top 5
          setShowDropdown(true);
        })
        .catch(err => console.error(err));
    }, 300); // Debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) && 
        searchRef.current && 
        !searchRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBookSelect = (book) => {
    setQuery('');
    setShowDropdown(false);
    setShowMobileSearch(false);
    navigate(`/book/${book.id}`);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    if (showMobileSearch) {
      setQuery('');
      setShowDropdown(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-10 flex items-center justify-between px-4 py-2 bg-white shadow-md h-12 pl-0">
        {/* Left - Logo and Nav Links */}
        <div className="flex items-center">
          <Link to='/'><img id="img-logo" src={logo} alt="ReadRave Logo" className="w-24 h-full" /></Link> 
          <div className='w-8 h-8 bg-[#d91c7d] p-1 cursor-pointer rounded-full mx-4'><Link to='/chatbot' className='' >🤖</Link></div>
          <div className="flex space-x-6">
            <Link to='/explore'> <button className="text-gray-600 font-semibold text-lg hover:text-[#2A92C9] hidden sm:block">Explore</button></Link>
          </div>
        </div>
        
        {/* Center - Search Bar (Desktop) */}
        <div className="relative hidden md:flex items-center justify-center pl-4 w-4/7">
          <FontAwesomeIcon 
            icon="search" 
            className="text-xl transition-all duration-300 hover:text-[#D91C7D] hover:scale-110 cursor-pointer"
          />
          <input
            ref={searchRef}
            type="text"
            className="bg-transparent text-lg border-none outline-none pl-4 text-[#2A92C9] opacity-90 w-full"
            placeholder="Search for Books"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowDropdown(true);
              }
            }}
          />
          
          {/* Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div 
              ref={dropdownRef}
              className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-72 overflow-y-auto"
            >
              {suggestions.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleBookSelect(book)}
                >
                  {book.thumbnail && (
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="w-10 h-14 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">{book.title}</p>
                    <p className="text-xs text-gray-500">
                      {book.authors?.join(', ') || 'Unknown Author'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right - Authentication Section */}
        <div className="flex items-center">
          {/* Mobile Search Button */}
          <button 
            onClick={toggleMobileSearch}
            className="md:hidden p-2 text-gray-600 hover:text-[#D91C7D] transition-colors mr-2"
          >
            <FontAwesomeIcon 
              icon={showMobileSearch ? "times" : "search"} 
              className="text-lg"
            />
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              {/* Logout Button */}
              <button 
                onClick={handleLogout} 
                className="text-white font-medium tracking-wider bg-[#D91C7D] rounded-full hover:bg-pink-700 focus:outline-none focus:ring-1 focus:ring-[#D91C7D] focus:ring-offset-2 px-4 py-1 text-sm"
              >
                Logout
              </button>
              <div 
                onClick={handleProfileClick}
                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#D91c7d] transition-all duration-200"
              >
                {user?.profilePic ? (
                  <img
                    src={`${VITE_API_BASE_URL}${user.profilePic}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={pfp}
                    alt="Default Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          ) : (
            <Link 
              to='/signup' 
              className="text-white font-medium tracking-wider bg-[#D91C7D] rounded-full hover:bg-pink-700 focus:outline-none focus:ring-1 focus:ring-[#D91C7D] focus:ring-offset-2 px-4 py-1 text-sm"
            >
              Sign-in 
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="fixed top-12 left-0 w-full z-10 bg-white shadow-md border-t border-gray-200 md:hidden">
          <div className="relative p-4">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <FontAwesomeIcon 
                icon="search" 
                className="text-gray-500 mr-3"
              />
              <input
                ref={searchRef}
                type="text"
                className="bg-transparent text-base border-none outline-none text-[#2A92C9] w-full"
                placeholder="Search for Books"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowDropdown(true);
                  }
                }}
                autoFocus
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setShowDropdown(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              )}
            </div>
            
            {/* Mobile Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute top-full mt-2 left-4 right-4 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-72 overflow-y-auto"
              >
                {suggestions.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleBookSelect(book)}
                  >
                    {book.thumbnail && (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {book.authors?.join(', ') || 'Unknown Author'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;