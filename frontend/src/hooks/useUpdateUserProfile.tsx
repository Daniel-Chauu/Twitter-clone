import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { apiFetch } from '../utils/apiFetch'

function useUpdateUserProfile<T>(body: T) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateProfileMutate, isPending: isUpdating } = useMutation({
    mutationFn: () =>
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

  return { updateProfileMutate, isUpdating }
}

export default useUpdateUserProfile
