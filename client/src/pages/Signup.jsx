import signupBanner from '../assets/images/signup-banner.png';
import Logo from'../assets/images/logo.png';
export default function Signup() {
    return (
      <div className='flex items-center justify-center overflow-hidden h-screen w-screen bg-[#D91C7D]
       '>
        <div className="flex  w-5/8 h-4/5 shadow-[0_0_2rem] shadow-gray-800 rounded-3xl overflow-hidden">
        
        {/* Left side - Image */}
        <div className="hidden md:block md:w-1/2 bg-pink-100">
          <img 
            src={signupBanner} 
            alt="Reading illustration" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Right side - Signup Form */}
        
        <div className="w-full md:w-1/2 flex-col items-center justify-center px-8 py-0 bg-white">
        <div className="logo block">
            <img src={Logo} alt="logo"  className='w-1/4'/>
        </div>
          <div className="w-full max-w-md space-y-6">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-wide text-[#D91C7D]">
                SignUp
              </h2>
              <p className=" text-gray-600">
                Create your account to unravel the magical world of ReadRave
              </p>
            </div>
            
            <form className="mt-0 space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Enter your name" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d91c7ea3]" 
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
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
                  placeholder="Enter your password" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d91c7ea3]" 
                  required
                />
              </div>
              
              <div>
                <button 
                  type="submit" 
                  className="w-full px-4 py-2 text-white font-medium tracking-wider bg-[#D91C7D] rounded-md hover:bg-pink-700 focus:outline-none focus:ring-1 focus:ring-[#d91c7ea3] focus:ring-offset-2"
                >
                  Sign Up
                </button>
              </div>
            </form>
            
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-pink-600 hover:text-pink-500">
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }