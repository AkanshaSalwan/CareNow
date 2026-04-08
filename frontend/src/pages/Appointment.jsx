import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')

    const navigate = useNavigate()

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSolts = async () => {

        setDocSlots([])

        const schedule = docInfo?.schedule || {}
        const slotStep = schedule.slotMinutes ?? 30

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {

            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            const weekday = currentDate.getDay()
            const weeklyDay = schedule.weekly?.[weekday]
            const isWorkingDay = weeklyDay
                ? !!weeklyDay.enabled
                : (schedule.daysOfWeek?.includes(weekday) ?? [1, 2, 3, 4, 5, 6].includes(weekday))

            // If doctor doesn't work on this weekday, add a placeholder (for date UI) with no times.
            if (!isWorkingDay) {
                setDocSlots(prev => ([...prev, [{ datetime: new Date(currentDate), time: null, disabled: true }]]))
                continue
            }

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            const [endHour, endMinute] = weeklyDay?.endTime
                ? weeklyDay.endTime.split(':').map(Number)
                : [schedule.endHour ?? 21, schedule.endMinute ?? 0]
            endTime.setHours(endHour, endMinute, 0, 0)

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                const [baseStartHour, baseStartMinute] = weeklyDay?.startTime
                    ? weeklyDay.startTime.split(':').map(Number)
                    : [schedule.startHour ?? 10, schedule.startMinute ?? 0]
                currentDate.setHours(currentDate.getHours() > baseStartHour ? currentDate.getHours() + 1 : baseStartHour)
                currentDate.setMinutes(currentDate.getMinutes() > baseStartMinute ? baseStartMinute : 0)
            } else {
                const [startHour, startMinute] = weeklyDay?.startTime
                    ? weeklyDay.startTime.split(':').map(Number)
                    : [schedule.startHour ?? 10, schedule.startMinute ?? 0]
                currentDate.setHours(startHour)
                currentDate.setMinutes(startMinute)
            }

            let timeSlots = [];


            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {

                    // Add slot to array
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                // Increment current time by configured slot duration
                currentDate.setMinutes(currentDate.getMinutes() + slotStep);
            }

            setDocSlots(prev => ([...prev, timeSlots]))

        }

    }

    const bookAppointment = async () => {

        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        if (!slotTime || !docSlots?.[slotIndex]?.some(s => s?.time)) {
            toast.error('Please select an available time slot')
            return
        }

        const date = docSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getDoctosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo])

    return docInfo ? (
        <div>
            <button
                type="button"
                onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                className='mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900'
            >
                <span aria-hidden="true">←</span> Back to all doctors
            </button>

            {/* ---------- Doctor Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className=' w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

                    {/* ----- Doc Info : name, degree, experience ----- */}
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>

                    {/* ----- Doc Address ----- */}
                    {docInfo.address && (
                        <div className='mt-4'>
                            <p className='text-sm font-medium text-[#262626]'>Address</p>
                            <p className='text-sm text-gray-600 mt-1'>
                                {docInfo.address?.line1}{docInfo.address?.line2 ? `, ${docInfo.address.line2}` : ''}
                            </p>
                        </div>
                    )}

                    <p className='text-gray-600 font-medium mt-4'>Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span> </p>
                </div>
            </div>

            {/* Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8'>
                <div className='border border-gray-200 rounded-xl bg-white p-5 sm:p-6'>
                    <div className='flex items-center justify-between gap-3'>
                        <p className='text-base sm:text-lg font-semibold text-gray-800'>Booking slots</p>
                        {slotTime ? (
                            <span className='text-xs sm:text-sm text-gray-500'>Selected: {slotTime.toLowerCase()}</span>
                        ) : (
                            <span className='text-xs sm:text-sm text-gray-500'>Pick a day & time</span>
                        )}
                    </div>

                    <p className='mt-4 text-sm font-medium text-gray-700'>Choose day</p>
                    <div className='flex gap-3 items-center w-full overflow-x-auto mt-3 pb-2'>
                    {docSlots.length && docSlots.map((item, index) => (
                        <button
                            type="button"
                            onClick={() => {
                                if (!item?.some(s => s?.time)) return
                                setSlotIndex(index)
                                setSlotTime('')
                            }}
                            key={index}
                            className={`min-w-16 px-4 py-3 rounded-xl text-center border transition-all ${
                                slotIndex === index
                                    ? 'bg-[#3ED2D1] border-[#3ED2D1] text-white shadow-sm'
                                    : item?.some(s => s?.time)
                                        ? 'bg-white border-gray-200 text-gray-700 hover:border-[#3ED2D1]'
                                        : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <p className='text-xs font-semibold'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p className='text-sm font-semibold'>{item[0] && item[0].datetime.getDate()}</p>
                        </button>
                    ))}
                    </div>

                    <p className='mt-4 text-sm font-medium text-gray-700'>Choose time</p>
                    <div className='mt-3 flex flex-wrap sm:flex-wrap gap-2 w-full max-sm:overflow-x-auto max-sm:flex-nowrap pb-2'>
                        {docSlots.length && docSlots[slotIndex].filter(s => s?.time).map((item, index) => (
                            <button
                                type="button"
                                onClick={() => setSlotTime(item.time)}
                                key={index}
                                className={`text-sm whitespace-nowrap px-4 py-2 rounded-full border transition-all ${
                                    item.time === slotTime
                                        ? 'bg-[#3ED2D1] border-[#3ED2D1] text-white'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#3ED2D1] hover:text-gray-900'
                                }`}
                            >
                                {item.time.toLowerCase()}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={bookAppointment}
                        disabled={!slotTime}
                        className={`mt-5 w-full sm:w-auto text-white text-sm font-medium px-10 py-3 rounded-full transition-all ${
                            slotTime ? 'bg-[#3ED2D1] hover:opacity-95' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Book an appointment
                    </button>
                </div>
            </div>

            {/* Listing Releated Doctors */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : null
}

export default Appointment