import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Image from '../components/Image'
import Carousel from '../components/Carousel'

import { useLocoScroll } from '../hooks/useLocoScroll'
import Genres from '../components/Genres'


function Home() {
  const locoScrollRef = useLocoScroll(true);

  useEffect(() => {
    // Update Locomotive after Carousel is mounted
    setTimeout(() => {
      locoScrollRef.current?.update();
    }, 300); // Give React enough time to render DOM
  }, []);

  return (
    <div data-scroll-container>
      <Navbar />
      <Hero />
      <Carousel />
      <Genres/>
      <Image />
      
    </div>
  );
}

export default Home;
