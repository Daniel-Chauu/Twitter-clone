import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { apiFetch } from '../../utils/apiFetch'
import toast from 'react-hot-toast'
import type { UserType } from '../../utils/type'

type EditFormData = {
  fullName: string
  username: string
  email: string
  bio: string
  link: string
  newPassword: string
  currentPassword: string
}

const EditProfileModal = ({ authUser }: { authUser?: UserType }) => {
  const [formData, setFormData] = useState<EditFormData>({
    fullName: '',
    username: '',
    email: '',
    bio: '',
    link: '',
    newPassword: '',
    currentPassword: ''
  })
  const queryClient = useQueryClient()

  const { mutate: updateProfileMutate, isPending: isUpdating } = useMutation({
    mutationFn: (body: Omit<EditFormData, 'username'>) =>
      apiFetch('/api/users/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include'
      }),
    onSuccess: (data) => {
      toast.success(data.message)
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['authUser'] }),
        queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      ])
    },
    onError: (error) => toast.error(error.message)
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullname,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
        newPassword: '',
        currentPassword: ''
      })
    }
  }, [authUser])

  return (
    <>
      <button
        className='btn btn-outline rounded-full btn-sm'
        onClick={() => {
          const myModal = document.getElementById('edit_profile_modal') as HTMLDialogElement
          if (myModal) myModal.showModal()
        }}
      >
        Edit profile
      </button>
      <dialog id='edit_profile_modal' className='modal'>
        <div className='modal-box border rounded-md border-gray-700 shadow-md'>
          <h3 className='font-bold text-lg my-3'>Update Profile</h3>
          <form
            className='flex flex-col gap-4'
            onSubmit={(e) => {
              e.preventDefault()
              updateProfileMutate(formData)
            }}
          >
            <div className='flex flex-wrap gap-2'>
              <input
                type='text'
                placeholder='Full Name'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.fullName}
                name='fullName'
                onChange={handleInputChange}
              />
              <input
                type='text'
                placeholder='Username'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.username}
                name='username'
                onChange={handleInputChange}
              />
            </div>
            <div className='flex flex-wrap gap-2'>
              <input
                type='email'
                placeholder='Email'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.email}
                name='email'
                onChange={handleInputChange}
              />
              <textarea
                placeholder='Bio'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.bio}
                name='bio'
                onChange={handleInputChange}
              />
            </div>
            <div className='flex flex-wrap gap-2'>
              <input
                type='password'
                placeholder='Current Password'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.currentPassword}
                name='currentPassword'
                onChange={handleInputChange}
              />
              <input
                type='password'
                placeholder='New Password'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.newPassword}
                name='newPassword'
                onChange={handleInputChange}
              />
            </div>
            <input
              type='text'
              placeholder='Link'
              className='flex-1 input border border-gray-700 rounded p-2 input-md'
              value={formData.link}
              name='link'
              onChange={handleInputChange}
            />
            <button className='btn btn-primary rounded-full btn-sm text-white'>
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
          </form>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button className='outline-none'>close</button>
        </form>
      </dialog>
    </>
  )
}
export default EditProfileModal
