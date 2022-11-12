import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import App from './App'
import './index.css'

import DashboardLayout from './Layouts/DashboardLayout';
import AuthLayout from './Layouts/AuthLayout';
import Login from './Pages/Auth/Login';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path='/'
        element={
          <DashboardLayout />
        }
      >
        <Route path='/dashboard' element={<App />} />
      </Route>

      <Route
        path='/'
        element={<AuthLayout />}
      >
        <Route path='/login' element={<Login />} />
      </Route>
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
