import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'

import { FaArrowLeft } from 'react-icons/fa6'
import { IoCalendarOutline } from 'react-icons/io5'
import { FaLink } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import ProfileHeaderSkeleton from '../../components/skeletons/ProfileHeaderSkeleton'
import { POSTS } from '../../utils/dummy'
import EditProfileModal from './EditProfileModal'
import Posts, { type FeedType } from '../../components/common/Posts'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../utils/apiFetch'
import type { GetProfileSuccessResponse } from '../../utils/type'
import type { SuccessResponse } from '../../utils/errors'
import useFollow from '../../hooks/useFollow'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Profile = () => {
  const [coverImg, setCoverImg] = useState<string | null>(null)
  const [profileImg, setProfileImg] = useState<string | null>(null)
  const [feedType, setFeedType] = useState<FeedType>('posts')

  const coverImgRef = useRef<HTMLInputElement | null>(null)
  const profileImgRef = useRef<HTMLInputElement | null>(null)

  const { username } = useParams()

  const { follow, isPending } = useFollow()
  const { data: authUser } = useQuery<SuccessResponse<GetProfileSuccessResponse>>({ queryKey: ['authUser'] })

  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => apiFetch<GetProfileSuccessResponse>(`/api/users/profile/${username}`)
  })

  const isMyProfile = authUser?.data?.user._id === data?.data?.user._id

  const user = data?.data?.user

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>, state: 'coverImg' | 'profileImg') => {
    let file
    if (e.target.files && e.target.files.length > 0) file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (state === 'coverImg') setCoverImg(reader.result as string)
        if (state === 'profileImg') setProfileImg(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const amIFollowing = authUser?.data?.user?.following?.includes(user?._id as string)

  useEffect(() => {
    refetch()
  }, [username, refetch])

  return (
    <>
      <div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}
        <div className='flex flex-col'>
          {!isLoading && user && (
            <>
              <div className='flex gap-10 px-4 py-2 items-center'>
                <Link to='/'>
                  <FaArrowLeft className='w-4 h-4' />
                </Link>
                <div className='flex flex-col'>
                  <p className='font-bold text-lg'>{user?.fullname}</p>
                  <span className='text-sm text-slate-500'>{POSTS?.length} posts</span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className='relative group/cover'>
                <img
                  src={coverImg || user?.coverImg || '/cover.png'}
                  className='h-52 w-full object-cover'
                  alt='cover image'
                />
                {isMyProfile && (
                  <div
                    className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
                    onClick={() => {
                      if (coverImgRef.current) coverImgRef.current.click()
                    }}
                  >
                    <MdEdit className='w-5 h-5 text-white' />
                  </div>
                )}

                <input
                  type='file'
                  accept='image/*'
                  hidden
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, 'coverImg')}
                />
                <input
                  type='file'
                  accept='image/*'
                  hidden
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, 'profileImg')}
                />
                {/* USER AVATAR */}
                <div className='avatar absolute -bottom-16 left-4'>
                  <div className='w-32 rounded-full relative group/avatar'>
                    <img src={profileImg || user?.profileImg || '/avatar-placeholder.png'} />
                    <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
                      {isMyProfile && (
                        <MdEdit
                          className='w-4 h-4 text-white'
                          onClick={() => {
                            if (profileImgRef.current) profileImgRef.current.click()
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex justify-end px-4 mt-5'>
                {isMyProfile && <EditProfileModal />}
                {!isMyProfile && (
                  <button
                    className='btn btn-outline rounded-full btn-sm'
                    onClick={() => {
                      follow(user._id)
                    }}
                  >
                    {isPending && 'Loading...'}
                    {!isPending && amIFollowing && 'Unfollow'}
                    {!isPending && !amIFollowing && 'Follow'}
                  </button>
                )}
                {(coverImg || profileImg) && (
                  <button
                    className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
                    onClick={() => alert('Profile updated successfully')}
                  >
                    Update
                  </button>
                )}
              </div>

              <div className='flex flex-col gap-4 mt-14 px-4'>
                <div className='flex flex-col'>
                  <span className='font-bold text-lg'>{user?.fullname}</span>
                  <span className='text-sm text-slate-500'>@{user?.username}</span>
                  <span className='text-sm my-1'>{user?.bio}</span>
                </div>

                <div className='flex gap-2 flex-wrap'>
                  {user?.link && (
                    <div className='flex gap-1 items-center '>
                      <>
                        <FaLink className='w-3 h-3 text-slate-500' />
                        <a
                          href='https://youtube.com/@asaprogrammer_'
                          target='_blank'
                          rel='noreferrer'
                          className='text-sm text-blue-500 hover:underline'
                        >
                          youtube.com/@asaprogrammer_
                        </a>
                      </>
                    </div>
                  )}
                  <div className='flex gap-2 items-center'>
                    <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                    <span className='text-sm text-slate-500'>Joined July 2021</span>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <div className='flex gap-1 items-center'>
                    <span className='font-bold text-xs'>{user?.following?.length}</span>
                    <span className='text-slate-500 text-xs'>Following</span>
                  </div>
                  <div className='flex gap-1 items-center'>
                    <span className='font-bold text-xs'>{user?.followers?.length}</span>
                    <span className='text-slate-500 text-xs'>Followers</span>
                  </div>
                </div>
              </div>
              <div className='flex w-full border-b border-gray-700 mt-4'>
                <div
                  className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                  onClick={() => setFeedType('posts')}
                >
                  Posts
                  {feedType === 'posts' && <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />}
                </div>
                <div
                  className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
                  onClick={() => setFeedType('likes')}
                >
                  Likes
                  {feedType === 'likes' && <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />}
                </div>
              </div>
            </>
          )}

          <Posts feedType={'forYou'} />
        </div>
      </div>
    </>
  )
}
export default Profile
