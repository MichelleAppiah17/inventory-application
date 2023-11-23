import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './BookCards.css';

// import required modules
import { Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const BookCards = ({headline, books}) => {
  //console.log(books)
  return (
    <div className='my-16 px-4 lg:px-24'>
        <h2 className='text-5xl text-center font-bold text-black my-5'>{headline}</h2>

        {/*cards */}
        <div className='mt-12'>
        <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination]}
        className="swiper-slide w-full h-full "
      >
        {
          books.map(book => <SwiperSlide className='swiper-slide' key={book._id}>
            <Link to={`/book/${book._id}`}>
              <div>
                <img src={book.imageUrl} alt=""/>
                <div className='absolute top-3 right-3 bg-blue-600 hover:bg-black p-2 rounded'>
                  <FaShoppingCart className='w-4 h-4 text-white'/>
                </div>
              </div>
              <div>
                <div className='mt-10'>
                  <h3 className='text-black'>{book.bookTitle}</h3>
                  <p className='text-black'>{book.authorName}</p>
                </div>
              </div>
            </Link>
          </SwiperSlide>)
        }
      </Swiper>

        </div>
    </div>
  )
}

export default BookCards;

