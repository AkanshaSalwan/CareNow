import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col md:flex-row bg-success rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10' style={{ backgroundColor: '#3ED2D1', height: '500px' }}>
            
            {/* ------- Left Side ------- */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
                <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white'>
                    <p>Book Appointment</p>
                    <p className='mt-4'>With 100+ Trusted Doctors</p>
                </div>
                <button
                    onClick={() => { navigate('/login'); scrollTo(0, 0); }}
                    className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'
                >
                    Create account
                </button>
            </div>

            {/* ------- Right Side (Desktop Only) ------- */}
            <div className='hidden md:flex md:w-1/2 lg:w-[370px] relative'>
                <img className='w-full h-full object-cover absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="Appointment" />
            </div>

            {/* ------- Right Side (Mobile) ------- */}
            <div className='md:hidden flex justify-center items-end mt-4'>
                <img className='w-3/4 h-auto max-w-md' src={assets.appointment_img} alt="Appointment" />
            </div>
        </div>
    );
}

export default Banner;
