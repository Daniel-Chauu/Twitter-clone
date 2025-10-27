import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'
import type { GetProfileSuccessResponse } from './utils/type.ts'
import { apiFetch } from './utils/apiFetch.ts'

const defaultQueryFn = async () => {
  try {
    const res = await apiFetch<GetProfileSuccessResponse>('/api/auth/me', {
      method: 'GET',
      credentials: 'include'
    })
    return res
  } catch (error) {
    return null
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      refetchOnWindowFocus: false
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position='top-right' />
      </QueryClientProvider>
    </BrowserRouter>
  </>
)
