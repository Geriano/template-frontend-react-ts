import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../hooks'

export default function () {
  const { authenticated } = useAppSelector(state => state.auth)

  if (!authenticated) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <div className="bg-gray-200 dark:bg-gray-900">
        <Outlet />
      </div>
    </>
  )
}