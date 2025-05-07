
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../assets/images/logo.png';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-2 bg-white shadow-md h-12 pl-0">
      {/* Left - Logo with Browse and Community buttons */}
      <div className="flex items-center">
        <img id="img-logo" src={logo} alt="ReadRave Logo" className="w-24 h-full mr-6" />
        
        {/* Browse and Community buttons - hidden on small screens, now closer to logo */}
        <div className="flex space-x-6">
          <button className="text-gray-600 font-semibold text-lg hover:text-[#2A92C9] hidden sm:block">Browse</button>
          <button className="text-gray-600 font-semibold text-lg hover:text-[#2A92C9] hidden sm:block">Community</button>
        </div>
      </div>
      
      {/* Center - Search Bar with custom styling */}
      <div className="hidden md:flex items-center justify-center pl-4 w-4/7">
        <FontAwesomeIcon 
          icon="search" 
          className="text-xl transition-all duration-300 hover:text-[#D91C7D] hover:scale-110 cursor-pointer"
        />
        <input
          type="text"
          className="bg-transparent text-lg border-none outline-none pl-4 text-[#2A92C9] opacity-60 w-full"
          placeholder="Search for Books"
        />
      </div>

      {/* Right - Sign-in Button */}
      <div className="flex items-center">
        <Link to='/signup' className="text-white font-medium tracking-wider bg-[#D91C7D] rounded-full hover:bg-pink-700 focus:outline-none focus:ring-1 focus:ring-[#D91C7D] focus:ring-offset-2 px-4 py-1">
          Sign-in 
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;