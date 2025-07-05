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
        <div data-scroll-section data-scroll-speed="2"className='w-screen h-[70vh] bg-cover bg-center bg-no-repeat z-50  flex'  style={{ backgroundImage: `url(${footerBg})` }}  >
            <div className="left w-1/2 h-full">
            <div className="links flex-col flex mt-[17%]  mb- text-white font-semibold text-lg">
             <span><Link to='/' className='mx-10 opacity-70 hover:opacity-100 transition duration-600'>Home</Link></span>
             <span><Link className='opacity-70 mx-10 hover:opacity-100 transition duration-600' >Explore</Link></span>
             <span><Link to='/profile' className='mx-10 opacity-70 hover:opacity-100 transition duration-600'>Profile</Link></span>
             <span><Link to='/chatbot' className='mx-10 opacity-70 hover:opacity-100 transition duration-600 '>Readrave Buddy</Link></span>
              <div className=' mx-2 text-sm relative mt-6     '> © 2025 ReadRave. Built with love by Saloni!</div>
             <div className="bottom mt-0">
                <h1 className='text-9xl  font-extrabold  opacity-30 tracking-tight'>READRAVE</h1>
                 
                
             </div>
            </div>
            </div>
            <div className="right w-1/2 h-[100%] flex flex-col">
           
            <img className='char h-[120%] ml-70  ' src={character}  alt="" />
            </div>

    
           

        </div>
    )
}

export default FooterMain
