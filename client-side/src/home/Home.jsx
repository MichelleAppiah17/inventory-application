import React from 'react'
import Banner from '../components/Banner';
import BestSellerBooks from './BestSellerBooks';
import FavBook from './FavBook';

const Home = () => {
  return (
    <div className='h-screen'>
        <div className='h-screen'>
            <Banner/>
            <BestSellerBooks/>
            <FavBook/>
        </div>
        <div className='h-screen'></div>
    </div>
  )
}

export default Home;