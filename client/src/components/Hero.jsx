import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import background_img from '../assets/images/background.png';
import device_hero from '../assets/images/device_hero.png';
import { useLocoScroll } from '../hooks/useLocoScroll'

const Hero = () => {
  useLocoScroll(true);
  useGSAP(() => {
    gsap.from('.heading', {
      opacity: 0,
      duration: 2,
      delay: 0.5,
      y: -20,
    });
  }, []);

  return (
    <div  className="w-full mt-8 lg:mt-12">
      <div
        className="w-full h-1/2 md:h-1/2  lg:h-screen max-h-screen overflow-hidden bg-cover bg-center bg-[#d91c7d] flex flex-col md:flex-row items-center justify-between px-4  md:px-10"
        style={{ backgroundImage: `url(${background_img})` }}
      >
        <div className="left w-full md:w-2/3 text-white md:ml-10 py-10 md:py-0">
          <div className="heading ml-0 md:ml-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-wider">WELCOME TO</h1>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold mt-4 tracking-wide">
              Read<span className="text-[#2A92C9]">Rave</span>
            </h1>
          </div>
          <div className="w-full md:w-[85%] my-4 md:my-8 opacity-70 text-justify px-2">
            Where tales alight and dreams cascade, in a symphony of words, hearts serenade. Join our poetic odyssey, where stories dance and souls sway, embracing the melody of literature's array. Uncover, connect, and let your spirit waltz away.
          </div>
        </div>
        <div className="right w-full md:w-1/2 text-white hidden md:block">
          <img src={device_hero} alt="Device showcase" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Hero;