import { Outlet } from 'react-router-dom'

export default function () {
  return (
    <>
      <div className="bg-gray-200 dark:bg-gray-900">
        <Outlet />
      </div>
    </>
  )
}