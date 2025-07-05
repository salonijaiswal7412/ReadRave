import { useState, useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';


import signupBanner from '../assets/images/signup-banner.png';
import Logo from '../assets/images/logo.png';
//import './CSS/signup-animation.css'; // Import the new CSS file

export default function Signup() {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // State for errors
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHidingError, setIsHidingError] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Set page as loaded after component mounts
  useEffect(() => {
    setPageLoaded(true);
  }, []);
  
  const { login } = useContext(AuthContext);
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', formData);
      login(response.data.token);
      navigate('/profile');
    } catch (err) {
      console.error('Signup error:', err);
      // Handle backend validation errors
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Improved error handling with animation
  const dismissError = () => {
    setIsHidingError(true);
    setTimeout(() => {
      setError('');
      setIsHidingError(false);
    }, 500);
  };

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dismissError();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className='flex items-center justify-center overflow-hidden h-screen w-screen bg-[#D91C7D]'>
      {/* Top error popup */}
      {error && (
        <div className={`fixed top-4 left-1/2 z-50 bg-white rounded-lg shadow-[0_0_2rem] border-l-4 border-red-500 px-4 py-3 max-w-md w-full flex items-center justify-between error-popup ${isHidingError ? 'hiding' : ''}`}>
          <div className="flex items-center">
            <div className="text-red-500 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-gray-800">{error}</p>
          </div>
          <button 
            className="text-gray-500 hover:text-gray-800"
            onClick={dismissError}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}

      <div className={`flex w-5/8 h-4/5 shadow-[0_0_2rem] shadow-gray-800 rounded-3xl overflow-hidden form-container-animation ${pageLoaded ? 'page-enter' : ''}`}>
        {/* Left side - Image */}
        <div className="hidden md:block md:w-1/2 bg-pink-100">
          <img
            src={signupBanner}
            alt="Reading illustration"
            className="w-full h-full object-cover banner-animation"
          />
        </div>

        {/* Right side - Signup Form */}
        <div className="w-full md:w-1/2 flex-col items-center justify-center px-8 py-4 bg-white">
          <div className="logo block logo-animation">
            <Link to='/'><img src={Logo} alt="logo" className='w-1/4' /></Link>
          </div>
          <div className="w-full max-w-md space-y-6">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-wide text-[#D91C7D] title-animation">SignUp</h2>
              <p className="text-gray-600 desc-animation">
                Create your account to unravel the magical world of ReadRave
              </p>
            </div>

            <form className="mt-0 space-y-4" onSubmit={handleSubmit}>
              <div className="form-group-1">
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d91c7ea3] input-animation"
                  required
                />
              </div>

              <div className="form-group-2">
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d91c7ea3] input-animation"
                  required
                />
              </div>

              <div className="form-group-3">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d91c7ea3] input-animation"
                  required
                />
              </div>

              <div className="form-group-3">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white font-medium tracking-wider bg-[#D91C7D] rounded-md hover:bg-pink-700 focus:outline-none focus:ring-1 focus:ring-[#d91c7ea3] focus:ring-offset-2 button-animation"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                </button>
              </div>
            </form>

            <div className="text-center text-sm form-group-3">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}