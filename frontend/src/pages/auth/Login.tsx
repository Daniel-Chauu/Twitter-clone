import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FaUser } from 'react-icons/fa'
import { MdPassword } from 'react-icons/md'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import XSvg from '../../components/svgs/X'
import { apiFetch } from '../../utils/apiFetch'
import { ApiError, type SuccessResponse } from '../../utils/errors'
import type { LoginSucessResponse, UserType } from '../../utils/type'

export type LoginFormData = {
  username: string
  password: string
}

const Login = () => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  })
  const navigate = useNavigate()

  const { isPending, error, mutate } = useMutation({
    mutationFn: async (body: LoginFormData) =>
      apiFetch<LoginSucessResponse>('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }),
    onSuccess: (data: SuccessResponse<LoginSucessResponse>) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
      navigate('/')
    },
    onError: (error) => {
      if (error instanceof ApiError && !error.isValidationError) toast.error(error.message)
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate(formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const getErrorByField = (field: 'username' | 'password') => {
    if (error instanceof ApiError && error.validationErrors) {
      return error.validationErrors[field]?.msg
    }
    return null
  }

  const isError = false

  return (
    <div className='max-w-7xl mx-auto flex h-screen'>
      <div className='flex-1 hidden lg:flex items-center  justify-center'>
        <XSvg className='lg:w-2/3 fill-white' />
      </div>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
          <XSvg className='w-24 lg:hidden fill-white' />
          <h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
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
          <button className='btn rounded-full btn-primary text-white'>
            {isPending ? <LoadingSpinner size='sm' /> : 'Login'}
          </button>
        </form>
        <div className='flex flex-col gap-2 mt-4'>
          <p className='text-white text-lg'>{"Don't"} have an account?</p>
          <Link to='/sign-up'>
            <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Login
