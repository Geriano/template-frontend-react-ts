import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import AuthService, { LoginSuccessResponse, Permission, Role } from '../Services/auth'

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
  user: UserState,
  token: string
}

export interface Login {
  username: string
  password: string
}

export const name = 'auth'

export const initialState: State = {
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
  token: '',
}

const login = createAsyncThunk('auth/login', async ({ username, password }: Login, api) => {
  try {
    return await AuthService.login(username, password)
  } catch (e) {
    return api.rejectWithValue(e)
  }
})

const logout = createAsyncThunk('auth/logout', () => AuthService.logout())

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    [login.fulfilled.name]: (state: State, action: PayloadAction<LoginSuccessResponse>)  => {
      const { user, token } = action.payload

      state.user.id = user.id
      state.user.name = user.name
      state.user.email = user.email
      state.user.username = user.username
      state.user.profile_photo_url = user.profile_photo_url
      state.user.permissions = user.permissions
      state.user.roles = user.roles

      state.token = token

      localStorage.setItem('token', token)
    },
    [login.rejected.name]: (state: State) => {
      state.user.id = 0
      state.user.name = ''
      state.user.email = ''
      state.user.username = ''
      state.user.profile_photo_url = ''
      state.user.roles = []
      state.user.permissions = []
      state.user.token = ''

      state.token = ''

      localStorage.removeItem('token')
    },
    [logout.fulfilled.name]: (state: State) => {
      state.user.id = 0
      state.user.name = ''
      state.user.email = ''
      state.user.username = ''
      state.user.profile_photo_url = ''
      state.user.roles = []
      state.user.permissions = []
      state.user.token = ''

      state.token = ''

      localStorage.removeItem('token')
    },
    [logout.rejected.name]: (state: State) => {
      // 
    },
  },
})

export default slice.reducer
