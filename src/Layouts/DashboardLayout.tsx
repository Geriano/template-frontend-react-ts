import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { Link, Navigate, Outlet, useLocation, useNavigate, useResolvedPath } from 'react-router-dom'
import Button from '../Components/Button'
import { useAppDispatch, useAppSelector } from '../hooks'
import { logout } from '../Slices/auth'

export interface SidebarLinkProps {
  icon: string
  name: string
  to: string
  open?: boolean
}

export const SidebarLink = ({ icon, name, to, open }: SidebarLinkProps) => {
  const location = useLocation()
  const route = useResolvedPath(to)
  const active = location.pathname === route.pathname
  
  return (
    <Link to={to}>
      <div 
        className={classNames("flex items-center space-x-1 border-b dark:border-gray-700 dark:hover:bg-gray-700 dark:text-white py-1 px-4 text-md hover:rounded-md transition-all duration-300", {
          'justify-center': !open,
          'dark:bg-gray-700 rounded-md': active,
        })}
      >
        <i className={icon}></i>
        <p className={classNames("capitalize font-semibold", {
          'hidden': !open,
        })}>
          {name}
        </p>
      </div>
    </Link>
  )
}

export default function () {
  const { authenticated, user } = useAppSelector(state => state.auth)
  const { queue: modals } = useAppSelector(state => state.modal)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  if (!authenticated) {
    return <Navigate to={"/login?from=" + location.pathname} />
  }

  const [open, setOpen] = useState({
    sidebar: Boolean(Number(localStorage.getItem('sidebar_open') || 0)),
    dropdown: false,
  })

  useEffect(() => localStorage.setItem('sidebar_open', Number(open.sidebar).toString()), [open])

  const dropdown = useRef<HTMLDivElement|null>(null)

  const focusout = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dropdown.current !== e.target && open.dropdown) {
      setTimeout(() => setOpen({ ...open, dropdown: false }), 100)
    }
  }

  const signout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => navigate('/login'))
  }

  return (
    <>
      <div onClick={focusout} className="relative flex w-full h-screen bg-gray-200 dark:bg-gray-900 dark:text-gray-300">
        <div className={classNames("flex-none flex flex-col space-y-2 h-screen bg-gray-100 dark:bg-gray-800 overflow-y-auto transition-all duration-300", {
          'w-64': open.sidebar,
          'w-16': !open.sidebar,
        })}>
          <div className="sticky top-0 flex-none flex items-center justify-between w-full h-16 dark:bg-slate-800 border-b dark:border-slate-700 px-4">
            <div className={classNames("flex-none flex items-center justify-center w-8 h-8", {
              'hidden': !open.sidebar,
            })} />

            <h1 className={classNames("text-xl text-center text-white font-bold", {
              'hidden': !open.sidebar,
            })}>
              { import.meta.env.VITE_APP_NAME || 'React TS' }
            </h1>

            <div className='flex-none flex items-center justify-center w-8 h-8'>
              <Button
                onClick={e => setOpen({ ...open, sidebar: !open.sidebar })}
                className='px-0 py-0 text-xl text-white'
              >
                <i className={classNames("mdi mdi-chevron-double-left transition-all duration-300", {
                  '-rotate-180': !open.sidebar,
                })} />
              </Button>
            </div>
          </div>

          <div
            className={classNames("flex flex-col space-y-2 w-full h-full", {
              'px-4': open.sidebar,
            })}
          >
            <SidebarLink to='dashboard' icon='mdi mdi-view-dashboard' name='dashboard' open={open.sidebar} />
          </div>
        </div>

        <div className="flex flex-col w-full h-screen overflow-y-auto">
          <div className="sticky top-0 flex-none flex items-center justify-end w-full h-16 dark:bg-slate-800 border-b dark:border-slate-700 px-4">
            <div className="relative flex items-center justify-end w-full max-w-xs text-gray-300">
              <div className="flex-none flex items-center justify-center w-16 h-16 p-2">
                <i className="mdi mdi-account text-xl" />
              </div>

              <div className='font-semibold capitalize'>
                { user.name }
              </div>

              <div className="flex-none flex items-center justify-center w-16 h-16 p-2">
                <Button 
                  onClick={e => setOpen({ ...open, dropdown: !open.dropdown })}
                  className='flex-none text-xl text-white'
                >
                  <i className="mdi mdi-menu-down" />
                </Button>
              </div>

              <div 
                ref={dropdown}
                className={classNames("absolute right-0 w-48 bg-gray-200 dark:bg-gray-800 border dark:border-gray-700 rounded-md p-4 transition-all duration-300", {
                  '-top-[100vh]': !open.dropdown,
                  'top-12': open.dropdown,
                })}
              >
                <Link to="/profile">
                  <div className="flex items-center space-x-1 border-b dark:border-gray-600 hover:text-gray-50 py-1">
                    <i className="mdi mdi-account"></i>
                    <p className="capitalize font-semibold">
                      profile
                    </p>
                  </div>
                </Link>

                <Button 
                  onClick={signout}
                  className='w-full rounded-none border-b dark:border-gray-600 px-0 hover:text-gray-50 py-1'
                >
                  <i className="mdi mdi-logout"></i>
                  <p className="capitalize font-semibold">
                    logout
                  </p>
                </Button>
              </div>
            </div>
          </div>

          <main className="py-6 px-4">
            <Outlet />
          </main>
        </div>
      </div>

      {
        modals
      }
    </>
  )
}