import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { loginByToken } from '../Slices/auth'

export default function () {
  const { authenticated, token } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const [processing, setProcessing] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!authenticated) {
      if (token) {
        if (!processing) {
          setProcessing(true)
          dispatch(loginByToken(token))
        }
      } else {
        setReady(true)
      }
    }
  }, [])

  if (authenticated) {
    return <Navigate to='/dashboard' />
  }

  return (
    <>
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 dark:text-gray-300 flex flex-col space-y-6 items-center justify-center">
        {
          ready && <Outlet />
        }
      </div>
    </>
  )
}