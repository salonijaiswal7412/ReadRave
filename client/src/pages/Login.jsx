import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import loginBanner from '../assets/images/signup-banner.png';
import Logo from '../assets/images/logo.png';
const VITE_API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${VITE_API_BASE_URL}/api/users/login`, {
        email,
        password,
      });

      const { token } = response.data;
      
      console.log('Login successful, token received:', token); // Debug log
      
      // Login through context (this will also fetch and store user profile data)
      const userData = await login(token);
      
      console.log('User data fetched and stored:', userData); // Debug log
      console.log('LocalStorage after login:', {
        token: localStorage.getItem('token'),
        userData: localStorage.getItem('userData')
      }); // Debug log
      
      // Check if there's a redirect URL stored (from book detail page)
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      
      console.log('Checking redirect URL:', redirectUrl); // Debug log
      
      if (redirectUrl) {
        // Clear the stored redirect URL
        localStorage.removeItem('redirectAfterLogin');
        console.log('Redirecting to:', redirectUrl); // Debug log
        // Navigate to the stored URL (book detail page)
        navigate(redirectUrl);
      } else {
        console.log('No redirect URL, going to profile'); // Debug log
        // Default redirect to profile if no specific redirect URL
        navigate('/profile');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-dismiss error after 5 seconds
  if (error) {
    setTimeout(() => {
      setError('');
    }, 5000);
  }

  return (
    <div className="flex items-center justify-center overflow-hidden h-screen w-screen bg-[#D91C7D]">
      {/* Top error popup */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg border-l-4 border-red-500 px-4 py-3 max-w-md w-full flex items-center justify-between">
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

      <div className="flex w-5/8 h-4/5 shadow-[0_0_2rem] shadow-gray-800 rounded-3xl overflow-hidden">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center px-8 py-4 bg-white">
          <div className="logo mb-6">
            <Link to='/'><img src={Logo} alt="logo" className="w-1/4" /></Link>
          </div>

          <div className="w-full max-w-md space-y-6">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-wide text-[#D91C7D] mb-2">
                Login
              </h2>
              <p className="text-gray-600">
                Welcome back to ReadRave! Log in to continue your reading adventure.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D91C7D]"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D91C7D]"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white font-medium tracking-wider bg-[#D91C7D] rounded-md hover:bg-pink-700 focus:outline-none focus:ring-1 focus:ring-[#D91C7D] focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Log In'}
                </button>
              </div>
            </form>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-pink-600 hover:text-pink-500">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 bg-pink-100">
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