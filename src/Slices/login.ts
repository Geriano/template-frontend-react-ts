import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { login } from "./auth"

export interface State {
  processing: boolean
  form: {
    username: string
    password: string
  },
  errors: {
    username: string
    password: string
  },
}

export const name = 'login'
export const initialState: State = {
  processing: false,
  form: {
    username: '',
    password: '',
  },
  errors: {
    username: '',
    password: '',
  },
}

interface SetterPayload {
  key: 'username'|'password'
  value: string
}

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    toggleProcessing: (state: State) => {
      state.processing = ! state.processing
    },
    setForm: (state: State, action: PayloadAction<SetterPayload>) => {
      const { key, value } = action.payload
      state.form[key] = value
    },
    setError: (state: State, action: PayloadAction<SetterPayload>) => {
      const { key, value } = action.payload
      state.errors[key] = value
    },
    reset: (state: State) => {
      state.form.username = ''
      state.form.password = ''
      state.errors.username = ''
      state.errors.password = ''
    },
  },
})

export const { toggleProcessing, setError, setForm, reset } = slice.actions

export default slice.reducer
