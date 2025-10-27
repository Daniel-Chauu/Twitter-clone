import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../utils/apiFetch'
import { POSTS } from '../../utils/dummy'
import type { GetPostsSuccessReponse } from '../../utils/type'
import PostSkeleton from '../skeletons/PostSkeleton'
import Post from './Post'
import { useEffect } from 'react'

const Posts = ({ feedType }: { feedType: 'following' | 'forYou' }) => {
  const getPostEndPoint = (feedType: 'following' | 'forYou') => {
    switch (feedType) {
      case 'forYou': {
        return 'api/posts'
      }
      case 'following': {
        return 'api/posts/following'
      }
      default:
        return 'api/posts'
    }
  }

  const {
    data: response,
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const endpoint = getPostEndPoint(feedType)
      return apiFetch<GetPostsSuccessReponse>(endpoint, {
        method: 'GET',
        credentials: 'include'
      })
    },
    retry: false
  })

  const posts = response?.data?.posts

  useEffect(() => {
    refetch()
  }, [feedType, refetch])

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className='flex flex-col justify-center'>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className='text-center my-4'>No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  )
}
export default Posts
