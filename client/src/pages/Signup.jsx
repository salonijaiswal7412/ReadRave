import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginBanner from '../assets/images/signup-banner.png';
import Logo from '../assets/images/logo.png';

export default function Login() {
  const navigate = useNavigate();
  const bannerRef = useRef(null);
  const formContainerRef = useRef(null);

  // State for form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State for errors
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Clear previous error
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email: formData.email,
        password: formData.password,
      });

      // If login is successful, store token and redirect
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      // Add animation before navigation
      if (bannerRef.current && formContainerRef.current) {
        bannerRef.current.style.transform = "translateX(-100%)";
        formContainerRef.current.style.transform = "scale(0)";
        
        // Wait for animation to complete before navigating
        setTimeout(() => {
          navigate('/profile');
        }, 700); // Match this with your CSS transition duration
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Redirect to signup with animation
  const redirectToSignup = (e) => {
    e.preventDefault();
    if (bannerRef.current && formContainerRef.current) {
      bannerRef.current.style.transform = "translateX(-100%)";
      formContainerRef.current.style.transform = "scale(0)";
      
      setTimeout(() => {
        navigate('/signup');
      }, 700);
    } else {
      navigate('/signup');
    }
  };

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  // Add entrance animation when component mounts
  useEffect(() => {
    if (bannerRef.current && formContainerRef.current) {
      // Start with elements transformed out
      bannerRef.current.style.transform = "translateX(-100%)";
      formContainerRef.current.style.transform = "scale(0)";
      
      // Then animate them in
      setTimeout(() => {
        bannerRef.current.style.transform = "translateX(0)";
        formContainerRef.current.style.transform = "scale(1)";
      }, 100);
    }
  }, []);

  return (
    <div className="flex items-center justify-center overflow-hidden h-screen w-screen bg-[#D91C7D]">
      {/* Top error popup */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-[0_0_2rem] border-l-4 border-red-500 px-4 py-3 max-w-md w-full flex items-center justify-between">
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
            onClick={() => setError('')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}

      <div className="bg-white flex w-5/8 h-4/5 shadow-[0_0_2rem] shadow-gray-800 rounded-3xl overflow-hidden">
        {/* Left side - Login Form with transition */}
        <div 
          ref={formContainerRef}
          className="w-full md:w-1/2 flex flex-col items-start justify-center px-8 py-4 bg-white"
          style={{ transition: "transform 0.7s ease-in-out" }}
        >
          <div className="logo block mb-6">
            <img src={Logo} alt="logo" className="w-1/4" />
          </div>
          <div className="w-full max-w-md space-y-6">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-wide text-[#D91C7D]">Login</h2>
              <p className="text-gray-600">
                Welcome back to ReadRave! Log in to continue your reading adventure.
              </p>
            </div>

            <form className="mt-0 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d91c7ea3]"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d91c7ea3]"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white font-medium tracking-wider bg-[#D91C7D] rounded-md hover:bg-pink-700 focus:outline-none focus:ring-1 focus:ring-[#d91c7ea3] focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Log In'}
                </button>
              </div>
            </form>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button 
                  onClick={redirectToSignup}
                  className="font-medium text-pink-600 hover:text-pink-500"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Image with transition */}
        <div 
          ref={bannerRef}
          className="hidden md:block md:w-1/2 bg-pink-100 transition-all duration-700" 
          style={{ transition: "transform 0.7s ease-in-out" }}
        >
          <img
            src={loginBanner}
            alt="Login illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}