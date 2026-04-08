import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='md:mx-10 mt-16'>
      <hr className='border-gray-200' />
      <div className='px-6 py-10 md:px-0'>
        <div className='grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10 text-sm'>

          <div>
            <img className='mb-4 w-36' src={assets.CareNow} alt="CareNow" />
            <p className='max-w-xl text-gray-600 leading-6'>
              CareNow helps you find trusted doctors and book appointments in minutes — simple, fast, and reliable healthcare access.
            </p>
          </div>

          <div>
            <p className='text-base font-semibold mb-4 text-gray-900'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
              <li><Link className='hover:text-gray-900' to='/'>Home</Link></li>
              <li><Link className='hover:text-gray-900' to='/doctors'>All Doctors</Link></li>
              <li><Link className='hover:text-gray-900' to='/about'>About</Link></li>
              <li><Link className='hover:text-gray-900' to='/contact'>Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className='text-base font-semibold mb-4 text-gray-900'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
              <li>Support: support@carenow.in</li>
              <li>Careers: careers@carenow.in</li>
              <li>Phone: +91 80 4XXX XXXX</li>
              <li className='text-xs text-gray-500 pt-1'>Mon–Sat 9:00 AM – 7:00 PM (IST)</li>
            </ul>
          </div>

        </div>

        <div className='mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3'>
          <p className='text-xs text-gray-500'>© {new Date().getFullYear()} CareNow. All rights reserved.</p>
          <div className='flex items-center gap-4 text-xs text-gray-500'>
            <Link className='hover:text-gray-900' to='/about'>Privacy</Link>
            <Link className='hover:text-gray-900' to='/about'>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
