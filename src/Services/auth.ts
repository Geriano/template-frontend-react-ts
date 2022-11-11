import axios from 'axios'
import { route } from '../service'

export interface Permission {
  name: string
}

export interface Role {
  name: string
  permissions: Permission[]
}

export interface LoginSuccessResponse {
  user: {
    id: number
    name: string
    email: string
    username: string
    profile_photo_url?: string
    permissions: Permission[]
    roles: Role[]
  },
  token: string
}

export interface RegsiterSuccessResponse {
  message: string
}

export const login = async (username: string, password: string) => {
  const { data: response } = await axios.post(route('authentication', 'login')!, {
    username, password,
  })

  return response as LoginSuccessResponse
}

export const register = async (name: string, email: string, username: string, password: string) => {
  const { data: response } = await axios.post(route('authentication', 'register')!, {
    name, email, username, password,
  })

  return response as RegsiterSuccessResponse
}

export const logout = () => axios.delete(route('authentication', 'logout')!)

export default {
  login, logout
}