import React from 'react';
import { assets } from '../assets/assets';

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap rounded-lg px-5 md:px-9 lg:px-19' 
         style={{ backgroundColor: '#3ED2D1', height: '600px' }}> 
      
      {/* --------- Header Right (Image) --------- */}
      <div className='w-full md:w-1/2 relative flex justify-center md:justify-end'>
        <img 
          className='w-3/4 h-auto rounded-lg md:absolute top-20 mr-5' 
          src={assets.about_image} 
          alt="About Us" 
        />
      </div>

      {/* --------- Header Left (Info) --------- */}
      <div className='w-full md:w-1/2 flex flex-col items-center md:items-start justify-center gap-4 py-6 md:py-[10vw]'>
        <p className='text-3xl md:text-4xl lg:text-6xl text-white font-semibold leading-snug md:leading-tight lg:leading-tight text-center md:text-left'>
          Book Appointment<br /> With Trusted Doctors
        </p>

        <div className='flex flex-col md:flex-row items-center gap-3 text-white text-base md:text-lg font-light'>
          <img className='w-24 md:w-28' src={assets.group_profiles} alt="Group Profiles" />
          <p className='text-center md:text-left'>
            Simply browse through our extensive list of trusted doctors, 
            <br className='hidden sm:block' /> 
            schedule your appointment hassle-free.
          </p>
        </div>
        
        <a href='#speciality' className='flex items-center gap-2 bg-white px-6 py-3 rounded-full text-gray-600 text-sm mt-4 md:mt-0 hover:scale-105 transition-all'>
          Book appointment 
          <img className='w-3' src={assets.arrow_icon} alt="Arrow Icon" />
        </a>
      </div>
    </div>
  );
}

export default Header;
