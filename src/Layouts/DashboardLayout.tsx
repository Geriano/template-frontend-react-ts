import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { Link, Navigate, Outlet, useLocation, useNavigate, useResolvedPath } from 'react-router-dom'
import Button from '../Components/Button'
import { useAppDispatch, useAppSelector } from '../hooks'
import { logout } from '../Slices/auth'
import { remove } from '../Slices/flash'

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
        className={classNames("flex items-center space-x-1 hover:bg-gray-200 border-b dark:border-gray-700 dark:hover:bg-gray-700 dark:text-white py-1 px-4 text-md transition-all duration-300", {
          'justify-center border-t': !open,
          'hover:rounded-md': open,
          'bg-gray-200 dark:bg-gray-700': active,
          'rounded-md': active && open,
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

export default function DashboardLayout() {
  const { authenticated, user } = useAppSelector(state => state.auth)
  const modals = useAppSelector(state => state.modal.queue)
  const flashes = useAppSelector(state => state.flash.value)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (flashes.length > 0) {
      flashes.forEach((_, i) => {
        setTimeout(() => {
          dispatch(remove(i))
        }, 3000)
      })
    }
  }, [flashes])

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

  if (!authenticated) {
    return <Navigate to={"/login?from=" + location.pathname} />
  }

  return (
    <>
      <div onClick={focusout} className="relative flex w-full h-screen bg-gray-200 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
        <div className={classNames("flex-none flex flex-col space-y-2 h-screen bg-gray-100 dark:bg-gray-800 overflow-y-auto transition-all duration-300", {
          'w-64': open.sidebar,
          'w-12': !open.sidebar,
        })}>
          <div className={classNames("sticky top-0 z-10 flex-none flex items-center w-full h-14 bg-gray-50 dark:bg-gray-800 border-b dark:border-slate-700", {
            'justify-between px-4': open.sidebar,
            'justify-center': !open.sidebar,
          })}>
            <div className={classNames("flex-none flex items-center justify-center w-8 h-8", {
              'hidden': !open.sidebar,
            })} />

            <h1 className={classNames("text-xl text-center dark:text-white font-bold", {
              'hidden': !open.sidebar,
            })}>
              { import.meta.env.VITE_APP_NAME || 'React TS' }
            </h1>

            <div className='flex-none flex items-center justify-center w-8 h-8'>
              <Button
                onClick={e => setOpen({ ...open, sidebar: !open.sidebar })}
                className='px-0 py-0 text-xl dark:text-white'
              >
                <i className={classNames("mdi mdi-chevron-double-left transition-all duration-700", {
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
          <div className="sticky top-0 z-10 flex-none flex items-center justify-end w-full h-14 bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-700 px-4">
            <div className="relative flex items-center justify-end w-full max-w-xs dark:text-gray-300">
              <div className="flex-none flex items-center justify-center w-16 h-16 p-2">
                <i className="mdi mdi-account text-xl" />
              </div>

              <div className='font-semibold capitalize'>
                { user.name }
              </div>

              <div className="flex-none flex items-center justify-center w-16 h-16 p-2">
                <Button 
                  onClick={e => setOpen({ ...open, dropdown: !open.dropdown })}
                  className='flex-none text-xl dark:text-white'
                >
                  <i className="mdi mdi-menu-down" />
                </Button>
              </div>

              <div 
                ref={dropdown}
                className={classNames("absolute right-0 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-4 transition-all duration-300", {
                  '-top-[100vh]': !open.dropdown,
                  'top-12': open.dropdown,
                })}
              >
                <Link to="/profile">
                  <div className="flex items-center space-x-1 border-b dark:border-gray-600 dark:hover:text-gray-50 py-1">
                    <i className="mdi mdi-account"></i>
                    <p className="capitalize font-semibold">
                      profile
                    </p>
                  </div>
                </Link>

                <Button 
                  onClick={signout}
                  className='w-full rounded-none border-b dark:border-gray-600 px-0 dark:hover:text-gray-50 py-1'
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

      {
        flashes.length > 0 && (
          <div className="fixed top-10 right-8 w-64 flex flex-col space-y-2 z-10">
            {
              flashes.map((flash, i) => {
                return (
                  <div key={i} className={classNames("w-full bg-white dark:bg-gray-900 dark:text-gray-200 border-l-8 px-4 py-2 rounded-md shadow dark:shadow-xl capitalize text-sm", {
                    'border-green-500': flash.type === 'success',
                    'border-red-500': flash.type === 'error',
                    'border-cyan-500': flash.type === 'info',
                    'border-orange-500': flash.type === 'warning',
                  })}>
                    { flash.message }
                  </div>
                )
              })
            }
          </div>
        )
      }
    </>
  )
}