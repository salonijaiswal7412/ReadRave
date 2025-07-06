import React from 'react'
import { useLocoScroll } from '../hooks/useLocoScroll'
import device from '../assets/images/devices.png'


const Image = () => {
    useLocoScroll(true);
  return (
    <div>
      <div data-scroll-section className="w-screen lg:h-[100vh] sm:h-[50vh]  md:h-[60vh] p-8 bg-white ">
        <img src={device} alt="" className='m-auto' />
      </div>
    </div>
  )
}

export default Image
