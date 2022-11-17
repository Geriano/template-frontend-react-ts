import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { loginByToken } from '../Slices/auth'

export default function () {
  const { authenticated, token, processing } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const [ready, setReady] = useState(false)
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  const to = search.get('from') || '/dashboard'

  useEffect(() => {
    if (!authenticated) {
      if (token) {
        if (!processing) {
          dispatch(loginByToken()).unwrap()
                                  .catch((e: AxiosError) => {
                                    if (e?.response?.status === 401) {
                                      window.location.pathname = `${to}`
                                    }
                                  })
        }
      } else {
        setReady(true)
      }
    }
  }, [])

  if (authenticated) {
    return <Navigate to={to} />
  }

  return (
    <>
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 dark:text-gray-300 flex flex-col space-y-6 items-center justify-center font-sans">
        {
          ready && <Outlet />
        }
      </div>
    </>
  )
}