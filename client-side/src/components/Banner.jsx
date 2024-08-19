import React from 'react'
import BannerCard from '../home/BannerCard'

const Banner = () => {
  return (
    <div className='px-4 lg:px-24 bg-teal-100 flex items-center'>
        <div className='flex w-full flex-col md:flex-row justify-between items-center gap-12 py-40'>
            {/*left side */}
            <div className='md:w-1/2 space-y-8 h-full'>
                <h2 className='text-5xl font-bold leading-snug text-black'>Plan your tasks while you get to buy Books <span className='text-blue-700'>for the Best Prices!</span>
                </h2>
                <p className='md:w-4/5'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur iste quos rerum, quaerat beatae eos impedit temporibus earum, totam tempore sint! Veniam modi laudantium tempore delectus saepe sequi ex sit.</p>
                <div>
                    <input type='search' name='search' id='search' placeholder='search a book' className='py-2 px-2 rounded-s-sm outline-none'/>
                    <button className='bg-blue-700 px-6 py-2 text-white font-medium hover:bg-black'>Search</button>
                </div>
            </div>

            {/*right side */}
            <div>
                <BannerCard/>
            </div>
        </div>
    </div>
  )
}

export default Banner