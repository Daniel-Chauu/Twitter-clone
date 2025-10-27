import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaUser } from 'react-icons/fa'
import { MdDriveFileRenameOutline, MdOutlineMail, MdPassword } from 'react-icons/md'
import { Link, useNavigate } from 'react-router'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import XSvg from '../../components/svgs/X'
import { apiFetch } from '../../utils/apiFetch'
import { ApiError, type SuccessResponse } from '../../utils/errors'
import type { SignUpSucessResponse, UserType } from '../../utils/type'

type SignUpDataForm = {
  email: string
  username: string
  fullname: string
  password: string
}

const SignUp = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<SignUpDataForm>({
    email: '',
    username: '',
    fullname: '',
    password: ''
  })

  const { mutate, error, isPending } = useMutation({
    mutationFn: async (body: SignUpDataForm) => {
      return apiFetch<SignUpSucessResponse>('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
    },
    onSuccess: (data: SuccessResponse<SignUpSucessResponse>) => {
      toast.success(data.message)
      navigate('/')
    },
    onError: (error) => {
      if (error instanceof ApiError && !error.isValidationError) toast.error(error.message)
    }
  })

  const getErrorByField = (field: 'email' | 'username' | 'fullname' | 'password') => {
    if (error instanceof ApiError && error.validationErrors) {
      return error.validationErrors[field]?.msg
    }
    return null
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)
    mutate(formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className='max-w-7xl mx-auto flex h-screen px-10'>
      <div className='flex-1 hidden lg:flex items-center  justify-center'>
        <XSvg className=' lg:w-2/3 fill-white' />
      </div>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
          <XSvg className='w-24 lg:hidden fill-white' />
          <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
          <label className='mb-3 input input-bordered rounded flex items-center gap-2'>
            <MdOutlineMail />
            <input
              type='email'
              className='grow'
              placeholder='Email'
              name='email'
              onChange={handleInputChange}
              value={formData.email}
            />

            {getErrorByField('email') && (
              <p className='w-full text-ellipsis overflow-hidden absolute bottom-[-50%] left-0 text-xs text-red-500'>
                {getErrorByField('email')}
              </p>
            )}
          </label>

          <label className='mb-2 input input-bordered rounded flex items-center gap-2'>
            <FaUser />
            <input
              type='text'
              className='grow '
              placeholder='Username'
              name='username'
              onChange={handleInputChange}
              value={formData.username}
            />

            {getErrorByField('username') && (
              <p className='w-full text-ellipsis overflow-hidden absolute bottom-[-50%] left-0 text-xs text-red-500'>
                {getErrorByField('username')}
              </p>
            )}
          </label>
          <label className='mb-2 input input-bordered rounded flex items-center gap-2'>
            <MdDriveFileRenameOutline />
            <input
              type='text'
              className='grow'
              placeholder='Full Name'
              name='fullname'
              onChange={handleInputChange}
              value={formData.fullname}
            />

            {getErrorByField('fullname') && (
              <p className='w-full text-ellipsis overflow-hidden absolute bottom-[-50%] left-0 text-xs text-red-500'>
                {getErrorByField('fullname')}
              </p>
            )}
          </label>

          <label className='mb-2 input input-bordered rounded flex items-center gap-2'>
            <MdPassword />
            <input
              type='password'
              className='grow'
              placeholder='Password'
              name='password'
              onChange={handleInputChange}
              value={formData.password}
            />

            {getErrorByField('password') && (
              <p className='w-full text-ellipsis overflow-hidden absolute bottom-[-50%] left-0 text-xs text-red-500'>
                {getErrorByField('password')}
              </p>
            )}
          </label>
          <button className='btn rounded-full btn-primary text-white' disabled={isPending}>
            {isPending ? <LoadingSpinner size='sm' /> : 'Sign up'}
          </button>
        </form>
        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
          <p className='text-white text-lg'>Already have an account?</p>
          <Link to='/login'>
            <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp
