import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div
            className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 rounded-2xl px-5 pt-5 pb-0 md:px-8 md:pt-6 md:pb-0 lg:px-10 lg:pt-7 lg:pb-0 overflow-hidden'
            style={{ backgroundColor: '#3ED2D1' }}
        >

            {/* --------- Header Left --------- */}
            <div className='w-full md:flex-1 flex flex-col items-start justify-center gap-3 pb-5 md:pb-6 lg:pb-7'>
                <p className='text-xl sm:text-2xl lg:text-3xl text-white font-semibold leading-snug'>
                    Book Appointment <br />  With Trusted Doctors
                </p>
                <div className='flex flex-col md:flex-row items-center gap-3 text-white text-xs sm:text-sm font-light'>
                    <img className='w-20 sm:w-24' src={assets.group_profiles} alt="" />
                    <p>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
                </div>
                <a href='#speciality' className='flex items-center gap-2 bg-white px-5 py-2 rounded-full text-[#595959] text-xs sm:text-sm hover:scale-[1.02] transition-all duration-300'>
                    Book appointment <img className='w-3' src={assets.arrow_icon} alt="" />
                </a>
            </div>

            {/* --------- Header Right --------- */}
            <div className='w-full md:w-auto flex justify-center md:justify-end self-end'>
                <img
                    className='w-full max-w-xs md:max-w-sm max-h-56 md:max-h-64 h-auto rounded-xl object-contain'
                    src={assets.header_img}
                    alt=""
                />
            </div>
        </div>
    )
}

export default Header