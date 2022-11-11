import { Outlet } from 'react-router-dom'

export default function () {
  return (
    <>
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 dark:text-gray-300 flex flex-col space-y-6 items-center justify-center">
        <Outlet />
      </div>
    </>
  )
}