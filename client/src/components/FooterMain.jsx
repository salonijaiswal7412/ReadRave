import React from 'react'
import { useLocoScroll } from '../hooks/useLocoScroll'
import gsap from 'gsap';
import footerBg from '../assets/images/footerbg.png';
import character from'../assets/images/char.png'
import { Link } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

function FooterMain() {
    useLocoScroll(true);

    return (
        <div 
            data-scroll-section 
            data-scroll-speed="2" 
            className='w-screen h-[45vh] xs:h-[50vh] sm:h-[55vh] md:h-[65vh] lg:h-[70vh] bg-[#d91c7d] lg:bg-cover lg:bg-center lg:bg-no-repeat z-50 flex flex-col lg:flex-row' 
            style={{ 
                backgroundImage: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `url(${footerBg})` : 'none'
            }}
        >
            <div className="left w-full lg:w-1/2 h-[50%] sm:h-[55%] lg:h-full flex flex-col justify-between lg:justify-start">
                <div className="links flex-col flex mt-[3%] xs:mt-[4%] sm:mt-[5%] md:mt-[8%] lg:mt-[17%] text-white font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-base xl:text-lg px-3 xs:px-4 lg:px-0">
                    <div className="navigation-links space-y-1 xs:space-y-1 sm:space-y-2 lg:space-y-0">
                        <span><Link to='/' className='mx-3 xs:mx-4 lg:mx-10 opacity-70 hover:opacity-100 transition duration-600 block py-1 lg:py-0'>Home</Link></span>
                        <span><Link to='/explore' className='opacity-70 mx-3 xs:mx-4 lg:mx-10 hover:opacity-100 transition duration-600 block py-1 lg:py-0'>Explore</Link></span>
                        <span><Link to='/profile' className='mx-3 xs:mx-4 lg:mx-10 opacity-70 hover:opacity-100 transition duration-600 block py-1 lg:py-0'>Profile</Link></span>
                        <span><Link to='/chatbot' className='mx-3 xs:mx-4 lg:mx-10 opacity-70 hover:opacity-100 transition duration-600 block py-1 lg:py-0'>Readrave Buddy</Link></span>
                    </div>
                    
                    <div className='mx-3 xs:mx-4 lg:mx-2 text-xs xs:text-xs sm:text-sm lg:text-sm opacity-80 mt-2 xs:mt-2 sm:mt-3 lg:mt-6'>
                        © 2025 ReadRave. Built with love for readers by a reader!
                    </div>
                    
                    <div className="bottom mt-1 xs:mt-1 sm:mt-2 lg:mt-0">
                        <h1 className='text-sm xs:text-lg sm:text-2xl md:text-4xl lg:text-9xl font-extrabold opacity-30 tracking-tight mx-3 xs:mx-4 lg:mx-0'>
                            READRAVE
                        </h1>
                    </div>
                </div>
            </div>
            
            <div className="right w-full lg:w-1/2 h-[50%] sm:h-[45%] lg:h-[100%] flex flex-col justify-end lg:justify-start overflow-hidden">
                <img 
                    className='char h-full w-full lg:w-auto lg:h-[120%] object-contain object-bottom lg:object-bottom lg:ml-70' 
                    src={character} 
                    alt="ReadRave Character" 
                />
            </div>
        </div>
    )
}

export default FooterMain