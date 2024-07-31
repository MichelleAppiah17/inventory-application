import React,{useEffect} from 'react'
import Banner from '../components/Banner';
import BestSellerBooks from './BestSellerBooks';
import FavBook from './FavBook';
import PromoBanner from './PromoBanner';
import OtherBooks from './OtherBooks';

const Home = () => {
   useEffect(() => {
     const initLandbot = () => {
       if (!window.myLandbot) {
         const s = document.createElement("script");
         s.type = "text/javascript";
         s.async = true;
         s.onload = function () {
           window.myLandbot = new Landbot.Livechat({
             configUrl:
               "https://storage.googleapis.com/landbot.online/v3/H-2569706-WO2IQWXN8HN3E8SP/index.json",
           });
           //   replace the configUrl with yours, this is mine, so that you can train it based on the books you have
         };
         s.src = "https://cdn.landbot.io/landbot-3/landbot-3.0.0.js";
         document.head.appendChild(s);
       }
     };

     window.addEventListener("mouseover", initLandbot, {
       once: true,
     });
     window.addEventListener("touchstart", initLandbot, {
       once: true,
     });

     return () => {
       window.removeEventListener("mouseover", initLandbot);
       window.removeEventListener("touchstart", initLandbot);
     };
   }, []);

  return (
    <div className='h-screen'>
        <div className='h-screen'>
            <Banner/>
            <BestSellerBooks/>
            <FavBook/>
            <PromoBanner/>
            <OtherBooks/>
        </div>
        <div className='h-screen'></div>
    </div>
  )
}

export default Home;