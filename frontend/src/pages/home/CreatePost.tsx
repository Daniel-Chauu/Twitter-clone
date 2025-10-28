import { CiImageOn } from 'react-icons/ci'
import { BsEmojiSmileFill } from 'react-icons/bs'
import { useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../utils/apiFetch'
import toast from 'react-hot-toast'
import type { GetProfileSuccessResponse } from '../../utils/type'
import type { SuccessResponse } from '../../utils/errors'

const CreatePost = () => {
  const [text, setText] = useState<string>('')
  const [img, setImg] = useState<string | null>('')

  const queryClient = useQueryClient()

  const imgRef = useRef<HTMLInputElement | null>(null)

  const { data: authUser } = useQuery<SuccessResponse<GetProfileSuccessResponse>>({ queryKey: ['authUser'] })

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (body: { img: string | null; text: string }) =>
      apiFetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include'
      }),
    onSuccess: (data) => {
      setImg('')
      setText('')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success(data.message)
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({ img, text })
  }

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file
    if (e.target.files && e.target.files.length > 0) {
      file = e.target.files[0]
    }
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImg(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
      <div className='avatar'>
        <div className='w-8 rounded-full'>
          <img src={authUser?.data?.user.profileImg || '/avatar-placeholder.png'} />
        </div>
      </div>
      <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
        <textarea
          className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
          placeholder='What is happening?!'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className='relative w-72 mx-auto'>
            <IoCloseSharp
              className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
              onClick={() => {
                setImg(null)
                if (imgRef.current) imgRef.current.value = ''
              }}
            />
            <img src={img} className='w-full mx-auto h-72 object-contain rounded' />
          </div>
        )}

        <div className='flex justify-between border-t py-2 border-t-gray-700'>
          <div className='flex gap-1 items-center'>
            <CiImageOn
              className='fill-primary w-6 h-6 cursor-pointer'
              onClick={() => {
                if (imgRef.current) imgRef.current.click()
              }}
            />
            <BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
          </div>
          <input type='file' hidden ref={imgRef} onChange={handleImgChange} />
          <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
            {isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
        {isError && <div className='text-red-500'>Something went wrong</div>}
      </form>
    </div>
  )
}
export default CreatePost
