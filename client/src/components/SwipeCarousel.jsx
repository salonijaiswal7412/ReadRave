import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay
} from 'swiper/modules';

// Import your original images
import slide_image_1 from '../assets/images/image1.png';
import slide_image_2 from '../assets/images/image2.png';
import slide_image_3 from '../assets/images/image3.png';
import slide_image_4 from '../assets/images/image4.png';
import slide_image_5 from '../assets/images/image5.png';
import slide_image_6 from '../assets/images/image6.png';

function SwipeCarousel() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 h-full mt-0 px-4">
      <div className="w-full sm:w-5/6 md:w-3/4 lg:w-2/3 max-w-2xl">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={'auto'}
          spaceBetween={0}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={false}
          navigation={false}
          modules={[EffectCoverflow, Autoplay]}
          className="swiper-container"
          style={{
            paddingTop: '20px',
            paddingBottom: '20px'
          }}
        >
          {[slide_image_1, slide_image_2, slide_image_3, slide_image_4, slide_image_5, slide_image_6].map((img, idx) => (
            <SwiperSlide className="swiper-slide-custom" key={idx}>
              <img
                src={img}
                alt={`slide_image_${idx + 1}`}
                className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover rounded-lg shadow-md transition-all duration-300 swiper-slide-image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .swiper-container {
          width: 100%;
          padding-top: 20px;
          padding-bottom: 50px;
        }

        .swiper-slide-custom {
          background-position: center;
          background-size: cover;
          width: 160px;
          height: auto;
          transition: all 0.3s ease;
        }

        @media (min-width: 640px) {
          .swiper-slide-custom {
            width: 180px;
          }
        }

        @media (min-width: 768px) {
          .swiper-slide-custom {
            width: 200px;
          }
        }

        @media (min-width: 1024px) {
          .swiper-slide-custom {
            width: 250px;
          }
        }

        .swiper-slide img {
          display: block;
          width: 100%;
        }

        .swiper-slide-active {
          transform: scale(1.1);
          z-index: 10;
        }

        .swiper-slide-active .swiper-slide-image {
          opacity: 1;
        }

        .swiper-slide:not(.swiper-slide-active) {
          transform: scale(0.85);
        }

        .swiper-slide:not(.swiper-slide-active) .swiper-slide-image {
          opacity: 0.7;
        }

        .swiper-slide-next .swiper-slide-image,
        .swiper-slide-prev .swiper-slide-image {
          opacity: 0.8;
        }

        .swiper-pagination-bullet {
          background: #374151;
          opacity: 0.5;
        }

        .swiper-pagination-bullet-active {
          background: #374151;
          opacity: 1;
        }

        .swiper-button-prev,
        .swiper-button-next {
          color: #374151;
          font-size: 20px;
          font-weight: bold;
        }

        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          color: #111827;
        }
      `}</style>
    </div>
  );
}

export default SwipeCarousel;
