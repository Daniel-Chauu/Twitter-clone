import { Navigate, Route, Routes, useLocation } from 'react-router'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import Notification from './pages/notification/Notification'
import Profile from './pages/profile/Profile'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './utils/apiFetch'
import LoadingSpinner from './components/common/LoadingSpinner'
import type { GetProfileSuccessResponse } from './utils/type'
import type { SuccessResponse } from './utils/errors'

function App() {
  const { data, isLoading } = useQuery<SuccessResponse<GetProfileSuccessResponse>>({
    queryKey: ['authUser'],
    retry: false
  })

  const authUser = data?.data?.user

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar />}
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to={'/login'} />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to={'/'} />} />
        <Route path='/sign-up' element={!authUser ? <SignUp /> : <Navigate to={'/'} />} />
        <Route path='/notifications' element={authUser ? <Notification /> : <Navigate to={'/login'} />} />
        <Route path='/profile/:username' element={authUser ? <Profile /> : <Navigate to={'/login'} />} />
      </Routes>
      {authUser && <RightPanel />}
    </div>
  )
}

export default App
