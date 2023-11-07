import React from 'react'
import Banner from '../components/Banner';
import FavoriteBook from './FavoriteBook';

const Home = () => {
  return (
    <div className='h-screen'>
        <div className='h-screen'>
            <Banner/>
            <FavoriteBook/>
        </div>
        <div className='h-screen bg-red-600'></div>
    </div>
  )
}

export default Home;