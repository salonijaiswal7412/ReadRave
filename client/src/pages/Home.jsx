import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Carousel from '../components/Carousel'
import { useLocoScroll } from '../hooks/useLocoScroll'

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
    </div>
  );
}

export default Home;
