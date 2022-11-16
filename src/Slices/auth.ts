import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import AuthService, { LoginSuccessResponse, Permission, Role, User } from '../Services/auth'
import { RootState } from '../store'

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
  processing: boolean
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
  processing: false,
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

export const loginByToken = createAsyncThunk('auth/login-by-current-token', async (_, api) => {
  const state = api.getState() as RootState
  
  if (state.auth.processing) {
    return api.abort()
  }

  api.dispatch(setProcessing())

  try {
    return await AuthService.loginByToken(state.auth.token)
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
    setProcessing: (state: State) => {
      state.processing = true
    },

    toggleProcessing: (state: State) => {
      state.processing = ! state.processing
    },

    removeProfilePhoto: (state: State) => {
      state.user.profile_photo_url = undefined
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state: State) => {
      state.processing = true
    })

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

      state.processing = false
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

      state.processing = false
    })

    builder.addCase(loginByToken.fulfilled, (state: State, action: PayloadAction<User|void>) => {
      if (!action.payload) {
        return
      }

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

      state.processing = false
    })

    builder.addCase(loginByToken.rejected, (state: State) => {
      state.token = ''

      localStorage.removeItem('token')
      axios.defaults.headers.common.Authorization = undefined

      state.processing = false
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

    builder.addCase(logout.pending, (state: State) => {
      state.processing = true
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

      state.processing = false
    })

    builder.addCase(logout.rejected, (state: State) => {
      state.processing = false
    })
  },
})

export const actions = slice.actions
export const { removeProfilePhoto, toggleProcessing, setProcessing } = slice.actions

export default slice.reducer
