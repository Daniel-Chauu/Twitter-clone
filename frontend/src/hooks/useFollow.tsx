import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../utils/apiFetch'
import toast from 'react-hot-toast'
import { ApiError } from '../utils/errors'

const useFollow = () => {
  const queryClient = useQueryClient()

  const {
    mutate: follow,
    isPending,
    variables
  } = useMutation({
    mutationFn: async (id: string) =>
      apiFetch(`/api/users/follow/${id}`, {
        method: 'POST',
        credentials: 'include'
      }),
    onSuccess: (data) => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] }),
        queryClient.invalidateQueries({ queryKey: ['authUser'] })
      ])
      toast.success(data.message)
    },
    onError: (error) => {
      //   if (error instanceof ApiError && !error.isValidationError) toast.error(error.message)

      toast.error(error.message)
    }
  })

  return { follow, isPending, variables }
}

export default useFollow
