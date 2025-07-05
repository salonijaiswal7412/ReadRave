import React from 'react'
import { Link } from 'react-router-dom';

function CommonFooter() {
  return (
    <div className='w-full h-52 bg-[#d91c7d] flex rounded-t-2xl overflow-hidden relative bottom-0'>
        <div className="left w-1/2 mt-6 text-white mx-2">
        <p className='mx-4 w-[70%] text-justify m-auto'> A cozy corner built for readers to explore books by genre, get smart recommendations, and enjoy a personalized reading journey — all in one thoughtfully designed space.</p>
        <h1 className='text-8xl font-extrabold tracking-tighter opacity-50 leading-34 '>READRAVE</h1></div>
        <div className="right w-1/2 mt-2">
         <div className="links flex-col flex sm:mt-[8%] lg:mt-[6%] mb- text-white font-semibold text-base sm:text-lg px-4 lg:px-0 text-end">
                    <span><Link to='/' className='mx-4 lg:mx-10 opacity-70 hover:opacity-100 transition duration-600'>Home</Link></span>
                    <span><Link to='/explore' className='opacity-70 mx-4 lg:mx-10 hover:opacity-100 transition duration-600'>Explore</Link></span>
                    <span><Link to='/profile' className='mx-4 lg:mx-10 opacity-70 hover:opacity-100 transition duration-600'>Profile</Link></span>
                    <span><Link to='/chatbot' className='mx-4 lg:mx-10 opacity-70 hover:opacity-100 transition duration-600'>Readrave Buddy</Link></span>
                   
                    <div className='text-sm relative mt-7 mx-8'>© 2025 ReadRave. Built with love for readers by a reader!</div>
                </div></div>
      
    </div>
  )
}

export default CommonFooter
