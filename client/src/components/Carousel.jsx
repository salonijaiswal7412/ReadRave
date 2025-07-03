import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocoScroll } from '../hooks/useLocoScroll';
import bg from '../assets/images/banner.png'
import SwipeCarousel from './SwipeCarousel';

function Carousel() {
    // Initialize LocomotiveScroll
    useLocoScroll(true);
    
    return (
        <div>
            <div
                data-scroll-section
                data-scroll-speed="1.1"
                className="w-screen min-h-screen bg-white p-4 md:p-8 flex flex-col lg:flex-row items-center justify-center"
            >
                <div className="left w-full lg:w-1/2 h-full mb-8 lg:mb-0 px-4 lg:px-0">
                    <img 
                        src={bg} 
                        className="rounded-lg shadow-[0_0_2rem] shadow-gray-600 w-full h-64 sm:h-80 md:h-96 lg:h-full object-cover max-h-[500px] lg:max-h-none" 
                        alt="Literature Banner" 
                    />
                </div>
                
                <div className="right w-full lg:w-1/2 h-full p-4 md:p-6 lg:p-10 lg:pl-18 overflow-hidden">
                    <h1 
                        data-scroll 
                        data-scroll-direction="horizontal" 
                        data-scroll-speed="2" 
                        className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-center lg:text-left text-[#d91c7d] mb-6 md:mb-8 lg:mb-0 '
                    >
                        EXPLORE THE WORLD OF LITERATURE
                    </h1>
                    
                    <p className='text-base sm:text-lg md:text-xl text-gray-500 mt-6 md:mt-10 lg:mt-14 text-justify leading-relaxed'>
                        Dive into a universe of stories, where summaries and reviews await your discovery. Explore diverse genres, share your insights, and unleash your creativity.
                    </p>
                    
                    <p className='text-base sm:text-lg md:text-xl text-gray-500 mt-4 md:mt-6 text-justify leading-relaxed'>
                        Join our vibrant community of book enthusiasts and embark on an endless literary adventure.
                    </p>
                    
                    <Link to='/signup'>
                        <button className='bg-[#d91c7d] p-2 md:p-3 rounded-full text-white font-semibold px-4 md:px-6 my-6 md:my-8 cursor-pointer transition-transform duration-400 capitalize hover:scale-105 hover:bg-white border-2 hover:border-[#d91c7d] hover:text-[#d91c7d] text-sm md:text-base block mx-auto lg:mx-0'>
                            Join Us
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Carousel;