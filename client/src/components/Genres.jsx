import React from 'react'
import { useLocoScroll } from '../hooks/useLocoScroll'
import {Link} from "react-router-dom"
import SwipeCarousel from './SwipeCarousel'

const Genres = () => {
    useLocoScroll(true);
    
    return (
        <div>
            <div data-scroll-section className="w-screen h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[90vh] bg-white p-4 md:p-8 flex flex-col lg:flex-row items-center justify-center">
                <div className="left w-full lg:w-1/2 h-full bg-white flex flex-col justify-center items-center mb-4 lg:mb-0">
                    <h1 
                        data-scroll 
                        data-scroll-direction="VERTICAL" 
                        data-scroll-speed="1.3" 
                        className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center text-[#2A92C9] mb-4 sm:mb-6 md:mb-8 px-4'
                    >
                        A WORLD OF GENRES AWAITS
                    </h1>
                    
                    <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 text-center sm:text-justify w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mb-4 sm:mb-6 md:mb-8 leading-relaxed px-2 sm:px-4'>
                        Explore our vast library spanning hundreds of genres, from timeless classics to cutting-edge contemporary works. Whether you crave thrilling mysteries, heartwarming romances, or mind-bending science fiction, there's something for every reader to discover and delight in on our shelves
                    </p>
                    
                    <Link to='/explore'>
                        <button className='bg-[#2A92C9] p-2 md:p-3 rounded-full text-white font-semibold px-4 md:px-6 cursor-pointer transition-all duration-300 capitalize hover:scale-105 hover:bg-white border-2 border-[#2A92C9] hover:border-[#2A92C9] hover:text-[#2A92C9] text-sm md:text-base shadow-md hover:shadow-lg'>
                            Explore
                        </button>
                    </Link>
                </div>
                
                <div className="right w-full lg:w-1/2 h-full hidden lg:flex items-center justify-center">
                    <SwipeCarousel/>
                </div>
            </div>
        </div>
    )
}

export default Genres