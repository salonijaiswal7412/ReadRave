import React from 'react'
import { Link } from 'react-router-dom';

function CommonFooter() {
  return (
    <div className='w-full h-44 sm:h-48 md:h-52 lg:h-52 bg-[#d91c7d] flex flex-col lg:flex-row rounded-t-2xl overflow-hidden relative bottom-0'>
        {/* Mobile/Tablet Layout */}
        <div className="block lg:hidden w-full h-full flex flex-col justify-between p-4">
            <div className="top flex justify-between items-start">
                <div className="description w-[60%]">
                    <p className='text-white text-sm sm:text-base text-justify leading-relaxed'> 
                        A cozy corner built for readers to explore books by genre, get smart recommendations, and enjoy a personalized reading journey.
                    </p>
                </div>
                <div className="links flex flex-col gap-2 text-white font-semibold text-sm sm:text-base text-right">
                    <Link to='/' className='opacity-70 hover:opacity-100 transition duration-600'>Home</Link>
                    <Link to='/explore' className='opacity-70 hover:opacity-100 transition duration-600'>Explore</Link>
                    <Link to='/profile' className='opacity-70 hover:opacity-100 transition duration-600'>Profile</Link>
                    <Link to='/chatbot' className='opacity-70 hover:opacity-100 transition duration-600'>Readrave Buddy</Link>
                </div>
            </div>
            
            <div className="bottom flex flex-col gap-2">
                <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter opacity-50 leading-none text-white'>READRAVE</h1>
                <div className='text-xs sm:text-sm text-white opacity-80'>
                    © 2025 ReadRave. Built with love for readers by a reader!
                </div>
            </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full h-full">
            <div className="left w-1/2 mt-6 text-white mx-2">
                <p className='mx-4 w-[70%] text-justify m-auto text-base'> 
                    A cozy corner built for readers to explore books by genre, get smart recommendations, and enjoy a personalized reading journey — all in one thoughtfully designed space.
                </p>
                <h1 className='text-8xl font-extrabold tracking-tighter opacity-50 leading-34'>READRAVE</h1>
            </div>
            <div className="right w-1/2 mt-2">
                <div className="links flex-col flex mt-[6%] text-white font-semibold text-base xl:text-lg px-0 text-end">
                    <span><Link to='/' className='mx-10 opacity-70 hover:opacity-100 transition duration-600'>Home</Link></span>
                    <span><Link to='/explore' className='opacity-70 mx-10 hover:opacity-100 transition duration-600'>Explore</Link></span>
                    <span><Link to='/profile' className='mx-10 opacity-70 hover:opacity-100 transition duration-600'>Profile</Link></span>
                    <span><Link to='/chatbot' className='mx-10 opacity-70 hover:opacity-100 transition duration-600'>Readrave Buddy</Link></span>
                    <div className='text-sm relative mt-7 mx-8'>© 2025 ReadRave. Built with love for readers by a reader!</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CommonFooter