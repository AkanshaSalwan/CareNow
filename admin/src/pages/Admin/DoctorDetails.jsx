import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'

const DoctorDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { aToken, doctors } = useContext(AdminContext)

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [loading, setLoading] = useState(true)
  const [doctor, setDoctor] = useState(null)

  const cachedDoctor = useMemo(() => doctors.find(d => d._id === id), [doctors, id])

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)

        // Show cached data immediately, then refresh from server
        if (cachedDoctor) setDoctor(cachedDoctor)

        const { data } = await axios.get(`${backendUrl}/api/admin/doctor/${id}`, {
          headers: { aToken }
        })

        if (data.success) {
          setDoctor(data.doctor)
        } else {
          toast.error(data.message)
        }
      } catch (err) {
        toast.error(err?.message || 'Failed to load doctor')
      } finally {
        setLoading(false)
      }
    }

    if (aToken && id) run()
  }, [aToken, id, backendUrl, cachedDoctor])

  if (loading && !doctor) {
    return (
      <div className='m-5 w-full'>
        <p className='text-lg font-medium'>Doctor Details</p>
        <div className='mt-4 text-gray-600'>Loading…</div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className='m-5 w-full'>
        <p className='text-lg font-medium'>Doctor Details</p>
        <div className='mt-4 text-gray-600'>Doctor not found.</div>
        <button onClick={() => navigate('/doctor-list')} className='mt-4 px-4 py-2 rounded-lg border hover:bg-white'>
          Back to list
        </button>
      </div>
    )
  }

  return (
    <div className='m-5 w-full'>
      <div className='flex items-center justify-between'>
        <p className='text-lg font-medium'>Doctor Details</p>
        <button onClick={() => navigate('/doctor-list')} className='px-4 py-2 rounded-lg border hover:bg-white'>
          Back
        </button>
      </div>

      <div className='mt-5 bg-white border rounded-xl p-6 max-w-5xl'>
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='flex items-center gap-4'>
            <img
              src={doctor.image}
              alt=''
              className='w-24 h-24 rounded-full object-cover bg-gray-100'
            />
            <div>
              <p className='text-xl font-semibold text-[#262626]'>{doctor.name}</p>
              <p className='text-gray-600'>{doctor.speciality}</p>
              <p className='text-sm text-gray-500'>{doctor.degree} • {doctor.experience}</p>
              <div className='mt-2 inline-flex items-center gap-2 text-sm'>
                <span className={`px-2 py-1 rounded-full ${doctor.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {doctor.available ? 'Available' : 'Not available'}
                </span>
                <span className='text-gray-600'>Fees: {doctor.fees}</span>
              </div>
            </div>
          </div>

          <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700'>
            <div>
              <p className='font-medium text-gray-600'>Email</p>
              <p>{doctor.email}</p>
            </div>
            <div>
              <p className='font-medium text-gray-600'>Address</p>
              <p>{doctor.address?.line1}</p>
              <p>{doctor.address?.line2}</p>
            </div>
            <div className='md:col-span-2'>
              <p className='font-medium text-gray-600'>About</p>
              <p className='mt-1 whitespace-pre-wrap'>{doctor.about}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetails

