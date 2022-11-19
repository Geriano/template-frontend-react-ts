import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AxiosError } from "axios"
import { ValidationErrorResponse } from "../Services/auth"
import { RootState } from "../store"
import { login as logon } from "./auth"
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
  key: keyof typeof initialState.form
  value: string
}

export const login = createAsyncThunk('login', async (_, api) => {
  const { login } = api.getState() as RootState
  
  return api.dispatch(logon({
    username: login.form.username,
    password: login.form.password,
  })).unwrap().catch(e => {
    if (e.status === 422) {
      const { errors } = e.data as ValidationErrorResponse

      errors.forEach(error => {
        api.dispatch(setError({
          key: error.field as keyof typeof initialState.errors,
          value: error.message,
        }))
      })
    } else if (e.status === 401) {
      api.dispatch(setError({
        key: 'password',
        value: e.data,
      }))
    } else {
      return api.rejectWithValue(e)
    }
  }).finally(() => {
    api.dispatch(setForm({
      key: 'password',
      value: "",
    }))
  })
})

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
  extraReducers: builder => {
    builder.addCase(login.pending, (state: State) => {
      state.processing = true

      state.errors.username = ''
      state.errors.password = ''
    })

    builder.addCase(login.fulfilled, (state: State) => {
      state.processing = false
    })

    builder.addCase(login.rejected, (state: State) => {
      state.processing = false
    })
  },
})

export const { toggleProcessing, setError, setForm, reset } = slice.actions

export default slice.reducer
