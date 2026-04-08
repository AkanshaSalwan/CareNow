import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const DoctorsList = () => {

  const { doctors, changeAvailability, aToken, getAllDoctors, updateDoctor, removeDoctor } = useContext(AdminContext)
  const navigate = useNavigate()
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [imgFile, setImgFile] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    speciality: '',
    degree: '',
    experience: '',
    fees: '',
    about: '',
    address1: '',
    address2: '',
    available: true
  })

  useEffect(() => {
    if (aToken) {
        getAllDoctors()
    }
}, [aToken])

  const previewUrl = useMemo(() => {
    if (imgFile) return URL.createObjectURL(imgFile)
    return editingDoctor?.image || ''
  }, [imgFile, editingDoctor])

  useEffect(() => {
    return () => {
      if (imgFile) URL.revokeObjectURL(previewUrl)
    }
  }, [imgFile, previewUrl])

  const openEdit = (doc) => {
    setEditingDoctor(doc)
    setImgFile(null)
    setForm({
      name: doc?.name || '',
      email: doc?.email || '',
      password: '',
      speciality: doc?.speciality || '',
      degree: doc?.degree || '',
      experience: doc?.experience || '',
      fees: doc?.fees ?? '',
      about: doc?.about || '',
      address1: doc?.address?.line1 || '',
      address2: doc?.address?.line2 || '',
      available: !!doc?.available
    })
  }

  const closeEdit = () => {
    setEditingDoctor(null)
    setImgFile(null)
  }

  const onSubmitEdit = async (e) => {
    e.preventDefault()
    if (!editingDoctor?._id) return

    try {
      const fd = new FormData()
      fd.append('docId', editingDoctor._id)
      fd.append('name', form.name)
      fd.append('email', form.email)
      if (form.password?.trim()) fd.append('password', form.password)
      fd.append('speciality', form.speciality)
      fd.append('degree', form.degree)
      fd.append('experience', form.experience)
      fd.append('fees', form.fees)
      fd.append('about', form.about)
      fd.append('available', String(form.available))
      fd.append('address', JSON.stringify({ line1: form.address1, line2: form.address2 }))
      if (imgFile) fd.append('image', imgFile)

      const result = await updateDoctor(fd)
      if (result?.success) closeEdit()
    } catch (err) {
      toast.error(err?.message || 'Failed to update doctor')
    }
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div
            className='border border-[#C9D8FF] rounded-xl w-56 overflow-hidden group bg-white flex flex-col cursor-pointer'
            key={index}
            onClick={() => navigate(`/doctor/${item._id}`)}
          >
            <img
              className='w-full h-36 object-cover bg-[#EAEFFF] group-hover:bg-[#3ED2D1] transition-all duration-500'
              src={item.image}
              alt=""
            />
            <div className='p-4 flex flex-col flex-1'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                />
                <p>Available</p>
              </div>
              <div className='mt-auto pt-3 flex items-center gap-2'>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    openEdit(item)
                  }}
                  className='flex-1 border border-[#3ED2D1] text-[#3ED2D1] hover:bg-[#3ED2D1] hover:text-white transition-all rounded-lg py-2 text-sm font-medium'
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation()
                    const ok = window.confirm(`Remove ${item.name}? This cannot be undone.`)
                    if (!ok) return
                    await removeDoctor(item._id)
                  }}
                  className='px-3 border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all rounded-lg py-2 text-sm font-medium'
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingDoctor && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='bg-white w-full max-w-3xl rounded-xl shadow-xl overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-4 border-b'>
              <p className='text-base font-semibold'>Edit Doctor Profile</p>
              <button type="button" onClick={closeEdit} className='text-2xl leading-none text-gray-500 hover:text-gray-700'>×</button>
            </div>

            <form onSubmit={onSubmitEdit} className='p-5 max-h-[80vh] overflow-y-auto'>
              <div className='flex flex-col lg:flex-row gap-6'>
                <div className='w-full lg:w-1/3'>
                  <p className='text-sm text-gray-600 mb-2'>Profile Image</p>
                  <div className='flex items-center gap-4'>
                    <img
                      className='w-20 h-20 rounded-full object-cover bg-gray-100'
                      src={previewUrl}
                      alt=""
                    />
                    <label className='cursor-pointer text-sm px-3 py-2 rounded border hover:bg-gray-50'>
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => setImgFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>

                <div className='w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700'>
                  <div className='flex flex-col gap-1'>
                    <p className='text-sm'>Name</p>
                    <input className='border rounded px-3 py-2' value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-sm'>Email</p>
                    <input type="email" className='border rounded px-3 py-2' value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-sm'>New Password (optional)</p>
                    <input type="password" className='border rounded px-3 py-2' value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} placeholder='Leave blank to keep current' />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-sm'>Speciality</p>
                    <input className='border rounded px-3 py-2' value={form.speciality} onChange={(e) => setForm(f => ({ ...f, speciality: e.target.value }))} required />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-sm'>Degree</p>
                    <input className='border rounded px-3 py-2' value={form.degree} onChange={(e) => setForm(f => ({ ...f, degree: e.target.value }))} required />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-sm'>Experience</p>
                    <input className='border rounded px-3 py-2' value={form.experience} onChange={(e) => setForm(f => ({ ...f, experience: e.target.value }))} required />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-sm'>Fees</p>
                    <input type="number" className='border rounded px-3 py-2' value={form.fees} onChange={(e) => setForm(f => ({ ...f, fees: e.target.value }))} required />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-sm'>Availability</p>
                    <select className='border rounded px-3 py-2' value={form.available ? 'true' : 'false'} onChange={(e) => setForm(f => ({ ...f, available: e.target.value === 'true' }))}>
                      <option value="true">Available</option>
                      <option value="false">Not available</option>
                    </select>
                  </div>
                  <div className='md:col-span-2 flex flex-col gap-1'>
                    <p className='text-sm'>Address</p>
                    <input className='border rounded px-3 py-2' value={form.address1} onChange={(e) => setForm(f => ({ ...f, address1: e.target.value }))} placeholder='Address line 1' required />
                    <input className='border rounded px-3 py-2' value={form.address2} onChange={(e) => setForm(f => ({ ...f, address2: e.target.value }))} placeholder='Address line 2' required />
                  </div>
                  <div className='md:col-span-2 flex flex-col gap-1'>
                    <p className='text-sm'>About</p>
                    <textarea className='border rounded px-3 py-2' rows={4} value={form.about} onChange={(e) => setForm(f => ({ ...f, about: e.target.value }))} required />
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-end gap-3 pt-5'>
                <button type="button" onClick={closeEdit} className='px-4 py-2 rounded-lg border hover:bg-gray-50'>Cancel</button>
                <button
                  type="button"
                  onClick={async () => {
                    const ok = window.confirm(`Remove ${editingDoctor?.name}? This cannot be undone.`)
                    if (!ok) return
                    const result = await removeDoctor(editingDoctor._id)
                    if (result?.success) closeEdit()
                  }}
                  className='px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-500 hover:text-white'
                >
                  Remove doctor
                </button>
                <button type="submit" className='px-5 py-2 rounded-lg bg-[#3ED2D1] text-white hover:opacity-95'>Save changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorsList