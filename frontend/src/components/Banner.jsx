import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Banner = () => {

    const navigate = useNavigate()  
    const { token } = useContext(AppContext)

    return (
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#3ED2D1] rounded-2xl px-5 pt-5 pb-0 md:px-8 md:pt-6 md:pb-0 lg:px-10 lg:pt-7 lg:pb-0 my-16 md:mx-10 overflow-hidden'>

            {/* ------- Left Side ------- */}
            <div className='w-full md:flex-1 flex flex-col justify-center items-start gap-2 py-6 md:py-0'>
                <div className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight'>
                    <p>Book Appointment</p>
                    <p className='mt-1'>With 100+ Trusted Doctors</p>
                </div>
                {!token && (
                    <button onClick={() => { navigate('/login'); scrollTo(0, 0) }} className='bg-white text-xs sm:text-sm text-[#595959] px-6 py-2 rounded-full mt-3 hover:scale-[1.02] transition-all '>
                        Create account
                    </button>
                )}
            </div>

            {/* ------- Right Side ------- */}
            <div className='hidden md:flex justify-end self-end'>
                <img className='w-full max-w-xs md:max-w-sm max-h-56 md:max-h-64 h-auto object-contain' src={assets.appointment_img} alt="" />
            </div>
        </div>
    )
}

export default Banner