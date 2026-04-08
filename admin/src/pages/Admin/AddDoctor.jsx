import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'

const AddDoctor = () => {

    const navigate = useNavigate()

    const dayOptions = [
        { value: 1, label: 'Mon' },
        { value: 2, label: 'Tue' },
        { value: 3, label: 'Wed' },
        { value: 4, label: 'Thu' },
        { value: 5, label: 'Fri' },
        { value: 6, label: 'Sat' },
        { value: 0, label: 'Sun' },
    ]

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [weekly, setWeekly] = useState(() => ({
        0: { enabled: false, startTime: '10:00', endTime: '21:00' },
        1: { enabled: true, startTime: '10:00', endTime: '21:00' },
        2: { enabled: true, startTime: '10:00', endTime: '21:00' },
        3: { enabled: true, startTime: '10:00', endTime: '21:00' },
        4: { enabled: true, startTime: '10:00', endTime: '21:00' },
        5: { enabled: true, startTime: '10:00', endTime: '21:00' },
        6: { enabled: true, startTime: '10:00', endTime: '21:00' },
    }))
    const [slotMinutes, setSlotMinutes] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { backendUrl } = useContext(AppContext)
    const { aToken, getAllDoctors } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (isSubmitting) return
            setIsSubmitting(true)
            const toastId = toast.loading('Adding doctor…')

            if (!docImg) {
                toast.update(toastId, { render: 'Image not selected', type: 'error', isLoading: false, autoClose: 2500 })
                return
            }

            const formData = new FormData();

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
            // schedule saved server-side (day-wise)
            const schedulePayload = { weekly }
            if (slotMinutes !== '') schedulePayload.slotMinutes = Number(slotMinutes)
            formData.append('schedule', JSON.stringify(schedulePayload))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.update(toastId, { render: data.message || 'Doctor added', type: 'success', isLoading: false, autoClose: 2500 })
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
                setWeekly({
                    0: { enabled: false, startTime: '10:00', endTime: '21:00' },
                    1: { enabled: true, startTime: '10:00', endTime: '21:00' },
                    2: { enabled: true, startTime: '10:00', endTime: '21:00' },
                    3: { enabled: true, startTime: '10:00', endTime: '21:00' },
                    4: { enabled: true, startTime: '10:00', endTime: '21:00' },
                    5: { enabled: true, startTime: '10:00', endTime: '21:00' },
                    6: { enabled: true, startTime: '10:00', endTime: '21:00' },
                })
                setSlotMinutes('')
                await getAllDoctors()
                navigate('/doctor-list')
            } else {
                toast.update(toastId, { render: data.message || 'Failed to add doctor', type: 'error', isLoading: false, autoClose: 3000 })
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Add Doctor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                    <p>Upload doctor <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Your name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Set Password</p>
                            <div className='relative'>
                                <input
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                    className='border rounded px-3 py-2 pr-10 w-full'
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Password'
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700'
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                            <path d="M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                            <path d="M6.2 6.2C3.8 8 2 12 2 12s3.5 7 10 7c2.1 0 3.9-.6 5.4-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                                            <path d="M9.9 4.2C10.6 4.1 11.3 4 12 4c6.5 0 10 8 10 8s-1 2.2-2.9 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='border rounded px-2 py-2' >
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Years</option>
                                <option value="3 Year">3 Years</option>
                                <option value="4 Year">4 Years</option>
                                <option value="5 Year">5 Years</option>
                                <option value="6 Year">6 Years</option>
                                <option value="7 Year">7 Years</option>
                                <option value="8 Year">8 Years</option>
                                <option value="9 Year">9 Years</option>
                                <option value="10 Year">10 Years</option>
                                <option value="11 Year">11 Years</option>
                                <option value="12 Year">12 Years</option>
                                <option value="13 Year">13 Years</option>
                                <option value="14 Year">14 Years</option>
                                <option value="15 Year">15 Years</option>
                                <option value="16 Year">16 Years</option>
                                <option value="17 Year">17 Years</option>
                                <option value="18 Year">18 Years</option>
                                <option value="19 Year">19 Years</option>
                                <option value="20 Year">20 Years</option> 
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Doctor fees' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-2'>
                            <p>Schedule (Days & Slots)</p>
                            <div className='grid grid-cols-1 gap-3'>
                                {dayOptions.map(d => (
                                    <div key={d.value} className='flex items-center justify-between gap-3 border rounded-lg px-3 py-2'>
                                        <label className='flex items-center gap-2 cursor-pointer select-none'>
                                            <input
                                                type="checkbox"
                                                checked={!!weekly?.[d.value]?.enabled}
                                                onChange={() => {
                                                    setWeekly(prev => ({
                                                        ...prev,
                                                        [d.value]: { ...prev[d.value], enabled: !prev[d.value]?.enabled }
                                                    }))
                                                }}
                                            />
                                            <span className='text-sm font-medium text-gray-700'>{d.label}</span>
                                        </label>
                                        <div className='flex items-center gap-2'>
                                            <input
                                                type="time"
                                                value={weekly?.[d.value]?.startTime || '10:00'}
                                                disabled={!weekly?.[d.value]?.enabled}
                                                onChange={(e) => {
                                                    const v = e.target.value
                                                    setWeekly(prev => ({ ...prev, [d.value]: { ...prev[d.value], startTime: v } }))
                                                }}
                                                className='border rounded px-2 py-1 text-sm disabled:bg-gray-100'
                                            />
                                            <span className='text-xs text-gray-500'>to</span>
                                            <input
                                                type="time"
                                                value={weekly?.[d.value]?.endTime || '21:00'}
                                                disabled={!weekly?.[d.value]?.enabled}
                                                onChange={(e) => {
                                                    const v = e.target.value
                                                    setWeekly(prev => ({ ...prev, [d.value]: { ...prev[d.value], endTime: v } }))
                                                }}
                                                className='border rounded px-2 py-1 text-sm disabled:bg-gray-100'
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-xs text-gray-500'>Slot duration (mins) (optional)</p>
                                        <select value={slotMinutes} onChange={(e) => setSlotMinutes(e.target.value)} className='border rounded px-3 py-2'>
                                            <option value=''>Default (30 mins)</option>
                                            <option value='15'>15</option>
                                            <option value='20'>20</option>
                                            <option value='30'>30</option>
                                            <option value='45'>45</option>
                                            <option value='60'>60</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <p className='text-xs text-gray-500'>These settings are saved on the server and used to generate booking slots.</p>
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded px-2 py-2'>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Degree</p>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Degree' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
                        </div>

                    </div>

                </div>

                <div>
                    <p className='mt-4 mb-2'>About Doctor</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='write about doctor'></textarea>
                </div>

                <button
                    type='submit'
                    disabled={isSubmitting}
                    className={`px-10 py-3 mt-4 text-white rounded-full ${isSubmitting ? 'bg-[#3ED2D1]/70 cursor-not-allowed' : 'bg-[#3ED2D1] hover:opacity-95'}`}
                >
                    {isSubmitting ? 'Adding…' : 'Add doctor'}
                </button>

            </div>


        </form>
    )
}

export default AddDoctor