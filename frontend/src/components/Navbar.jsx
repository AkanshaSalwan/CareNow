import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()

  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  const mobileLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 py-2 ${isActive ? 'text-[#3ED2D1]' : 'text-gray-600'}`

  const mobileIconClass = ({ isActive }) =>
    `w-5 h-5 ${isActive ? 'text-[#3ED2D1]' : 'text-gray-500'}`

  return (
    <>
      <div className='sticky top-0 z-40 bg-white flex items-center justify-between text-sm h-20 py-4 mb-5 border-b border-b-[#ADADAD]'>
        <img
          onClick={() => navigate('/')}
          className='w-40 sm:w-52 md:w-64 h-auto cursor-pointer'
          src={assets.CareNow}
          alt="CareNow"
        />
      <ul className='md:flex items-start gap-5  font-medium hidden'>
        <NavLink to='/' >
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-[#3ED2D1] w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors' >
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-[#3ED2D1] w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about' >
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-[#3ED2D1] w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact' >
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-[#3ED2D1] w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4 '>
        {
          token && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={userData.image} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-[#3ED2D1] text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
        }
      </div>
      </div>

      {/* ---- Mobile Bottom Nav ---- */}
      <nav
        className='md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200'
        aria-label='Bottom navigation'
      >
        <div className='flex items-stretch'>
          <NavLink to='/' className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                <svg className={mobileIconClass({ isActive })} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
                </svg>
                <span className='text-[11px] font-medium'>Home</span>
              </>
            )}
          </NavLink>

          <NavLink to='/doctors' className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                <svg className={mobileIconClass({ isActive })} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M10 2h4v4h4v4h-4v4h-4v-4H6V6h4V2Z' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
                  <path d='M6 22h12a3 3 0 0 0 3-3v-7a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v7a3 3 0 0 0 3 3Z' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
                </svg>
                <span className='text-[11px] font-medium'>Doctors</span>
              </>
            )}
          </NavLink>

          <NavLink to='/about' className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                <svg className={mobileIconClass({ isActive })} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z' stroke='currentColor' strokeWidth='1.8' />
                  <path d='M12 10.5v6' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
                  <path d='M12 7.5h.01' stroke='currentColor' strokeWidth='2.6' strokeLinecap='round' />
                </svg>
                <span className='text-[11px] font-medium'>About</span>
              </>
            )}
          </NavLink>

          <NavLink to='/contact' className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                <svg className={mobileIconClass({ isActive })} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z' stroke='currentColor' strokeWidth='1.8' />
                  <path d='M4.5 7.5 12 13l7.5-5.5' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
                </svg>
                <span className='text-[11px] font-medium'>Contact</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </>
  )
}

export default Navbar