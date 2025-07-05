import React from 'react'
import robo from '../assets/images/robo.png'
import { useLocoScroll } from '../hooks/useLocoScroll'
import { Link } from 'react-router-dom';

function ChatbotBanner() {
    useLocoScroll(true);
  return (
    <div data-scroll-section className='w-screen min-h-[80vh] p-4 sm:p-6 md:p-8 lg:p-10 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 bg-white'>
        <div className="bg bg-[#2A92C9] h-full min-h-[70vh] rounded-2xl shadow-[0_0_2rem] shadow-gray-500 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center lg:items-stretch">
            
            {/* Left side - Robot image */}
            <div className="left w-full lg:w-1/3 flex justify-center lg:justify-start mb-6 lg:mb-0">
                <img src={robo} className='h-[140%] max-h-96 object-end' alt="ReadRave Buddy Robot" />
            </div>
            
            {/* Right side - Content */}
            <div className="right w-full lg:w-2/3 lg:mt-8 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tighter mb-4">
                    Not sure what to read next?
                </h2>
                
                <div className='font-medium text-lg sm:text-xl text-gray-100 mb-4'>
                    Let ReadRave Buddy help you discover your next favorite book
                </div>
                
                <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-none lg:max-w-xl text-justify lg:text-left w-full lg:w-[75%] tracking-tight leading-6 mb-6 sm:mb-8 px-2 lg:px-0 lg:mx-10">
                    Whether you're into cozy sci-fi, dramatic romance, or fast-paced thrillers, our AI-powered book buddy will guide you through handpicked reads that match your preferences perfectly. Answer a few quick questions and let the magic begin!
                </p>
                
                <div className="flex justify-center lg:justify-start lg:ml-80">
                    <Link to='/chatbot' className="bg-white text-[#d91c7d] px-4 sm:px-6 py-2 rounded-full font-semibold shadow-md hover:cursor-pointer transition hover:shadow-2xl inline-block">
                        <span className='opacity-70 hover:opacity-100 transition text-sm sm:text-base'>
                            Talk to ReadRave Buddy →
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatbotBanner