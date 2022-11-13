import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import AuthService, { LoginSuccessResponse, Permission, Role, User } from '../Services/auth'

export interface UserState {
  id: number
  name: string
  email: string
  username: string
  profile_photo_url?: string
  roles: Role[]
  permissions: Permission[]
  token: string
}

export interface State {
  authenticated: boolean
  user: UserState,
  token: string
}

export interface Login {
  username: string
  password: string
}

export const name = 'auth'

export const initialState: State = {
  authenticated: false,
  user: {
    id: 0,
    name: '',
    email: '',
    username: '',
    profile_photo_url: '',
    roles: [],
    permissions: [],
    token: '',
  },
  token: localStorage.getItem('token') || '',
}

export const loginByToken = createAsyncThunk('auth/login-by-current-token', async (token: string, api) => {
  try {
    return await AuthService.loginByToken(token)
  } catch (e) {
    return api.rejectWithValue(e)
  }
})

export const relog = createAsyncThunk('auth/relog', async (_, api) => {
  try {
    return await AuthService.loginByToken(localStorage.getItem('token') || '')
  } catch (e) {
    return api.rejectWithValue(e)
  }
})

export const login = createAsyncThunk('auth/login', async ({ username, password }: Login, api) => {
  try {
    return await AuthService.login(username, password)
  } catch (e) {
    const error = e as AxiosError
    return api.rejectWithValue({
      code: error.response?.status,
      data: error.response?.data,
    })
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, api) => {
  try {
    await AuthService.logout()
  } catch (e) {
    api.rejectWithValue(e)
  }
})

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    removeProfilePhoto: (state: State) => {
      state.user.profile_photo_url = undefined
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state: State, action: PayloadAction<LoginSuccessResponse>)  => {
      const { user, token } = action.payload

      state.user.id = user.id
      state.user.name = user.name
      state.user.email = user.email
      state.user.username = user.username
      state.user.profile_photo_url = user.profile_photo_url
      state.user.permissions = user.permissions
      state.user.roles = user.roles

      state.token = token
      state.authenticated = true

      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    })

    builder.addCase(login.rejected, (state: State) => {
      state.user.id = 0
      state.user.name = ''
      state.user.email = ''
      state.user.username = ''
      state.user.profile_photo_url = ''
      state.user.roles = []
      state.user.permissions = []
      state.user.token = ''

      state.token = ''
      state.authenticated = false

      localStorage.removeItem('token')
      axios.defaults.headers.common.Authorization = undefined
    })

    builder.addCase(loginByToken.fulfilled, (state: State, action: PayloadAction<User>) => {
      const { id, name, email, username, profile_photo_url, permissions, roles } = action.payload

      state.authenticated = true
      state.user.id = id
      state.user.name = name
      state.user.email = email
      state.user.username = username
      state.user.profile_photo_url = profile_photo_url
      state.user.permissions = permissions
      state.user.roles = roles

      axios.defaults.headers.common.Authorization = `Bearer ${state.token}`
    })

    builder.addCase(loginByToken.rejected, (state: State) => {
      state.token = ''

      localStorage.removeItem('token')
      axios.defaults.headers.common.Authorization = undefined
    })

    builder.addCase(relog.fulfilled, (state: State, action: PayloadAction<User>) => {
      const { id, name, email, username, profile_photo_url, permissions, roles } = action.payload

      state.authenticated = true
      state.user.id = id
      state.user.name = name
      state.user.email = email
      state.user.username = username
      state.user.profile_photo_url = profile_photo_url
      state.user.permissions = permissions
      state.user.roles = roles

      axios.defaults.headers.common.Authorization = `Bearer ${state.token}`
    })

    builder.addCase(relog.rejected, (state: State) => {
      state.token = ''

      localStorage.removeItem('token')
      axios.defaults.headers.common.Authorization = undefined
    })

    builder.addCase(logout.fulfilled, (state: State) => {
      state.user.id = 0
      state.user.name = ''
      state.user.email = ''
      state.user.username = ''
      state.user.profile_photo_url = ''
      state.user.roles = []
      state.user.permissions = []
      state.user.token = ''

      state.token = ''
      state.authenticated = false

      localStorage.removeItem('token')
    })

    builder.addCase(logout.rejected, (state: State) => {
      // 
    })
  },
})

export const actions = slice.actions
export const { removeProfilePhoto } = slice.actions

export default slice.reducer
