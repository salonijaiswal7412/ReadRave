import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocoScroll } from '../hooks/useLocoScroll';
import bg from '../assets/images/banner.png'


function Carousel() {
    // Initialize LocomotiveScroll
    useLocoScroll(true);

   

    return (
        <div>
            <div
                data-scroll-section
                data-scroll-speed="1.1"
                className="w-screen h-screen bg-white p-8 flex items-center justify-center"
            >
                <div className="left  w-1/2 h-full">
                <img src={bg} className="rounded-lg shadow-[0_0_2rem] shadow-gray-600" alt="" />
                
                </div>
                <div className="right  w-1/2 h-full  p-10 pl-18 overflow-hidden ">
                    <h1 data-scroll data-scroll-direction="horizontal" data-scroll-speed="2" className='text-4xl font-bold text-center m-auto text-[#d91c7d]'>EXPLORE THE WORLD OF LITERATURE</h1>
                    <p className='text-xl text-gray-500 mt-14 text-justify'>Dive into a universe of stories, where summaries and reviews await your discovery. Explore diverse genres, share your insights, and unleash your creativity.</p>
                    <p className='text-xl text-gray-500 mt-6 text-justify'>
                        Join our vibrant community of book enthusiasts and embark on an endless literary adventure.</p>
                    <Link to='/signup'>
                    <button className='bg-[#d91c7d] p-2 rounded-full text-white font-semibold px-4 my-8 cursor-pointer transition-transform duration-400 capitalize hover:scale-103 hover:bg-white border-2 hover:border-[#d91c7d] hover:text-[#d91c7d]'>Join Us</button></Link>

                </div>
            </div>
        </div>
    );
}

export default Carousel;
