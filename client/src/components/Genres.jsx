import React from 'react'
import { useLocoScroll } from '../hooks/useLocoScroll'
import {Link} from "react-router-dom"

const Genres = () => {
    useLocoScroll(true);
  return (
    
    <div>
        <div  data-scroll-section className="w-screen h-screen bg-white p-8 flex items-center justify-center">
            <div className="left w-1/2 h-full bg-white">
            <h1 data-scroll data-scroll-direction="VERTICAL" data-scroll-speed="1.3" className='text-4xl font-bold text-center m-auto mt-16 text-[#2A92C9]'>    A WORLD OF GENRES AWAITS </h1>
            <p className='text-xl text-gray-500 mt-12 text-justify w-[80%] m-auto'>Explore our vast library spanning hundreds of genres, from timeless classics to cutting-edge contemporary works. Whether you crave thrilling mysteries, heartwarming romances, or mind-bending science fiction, there's something for every reader to discover and delight in on our shelves</p>
            <Link to=''>
            <button className='bg-[#2A92C9] p-2 rounded-full text-white font-semibold px-4 my-8 cursor-pointer transition-transform duration-400 capitalize hover:scale-103 hover:bg-white border-2 hover:border-[#2A92C9] hover:text-[#2A92C9] mx-16'>Explore</button></Link></div>
            <div className="right w-1/2 h-full"></div>
        </div>
      
    </div>
  )
}

export default Genres
