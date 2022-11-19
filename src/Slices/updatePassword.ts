import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import route from "../route"
import { ValidationErrorResponse } from "../Services/auth"
import { RootState } from "../store"
import { success } from "./flash"

interface State {
  processing: boolean
  form: {
    current_password: string
    password: string
    password_confirmation: string
  }
  errors: {
    current_password: string
    password: string
    password_confirmation: string
  }
}

export const name = 'updatePassword'

export const initialState: State = {
  processing: false,
  form: {
    current_password: '',
    password: '',
    password_confirmation: '',
  },
  errors: {
    current_password: '',
    password: '',
    password_confirmation: '',
  },
}

export const update = createAsyncThunk('update', async (_, api) => {
  const { updatePassword } = api.getState() as RootState

  try {
    const { data: response } = await axios.patch(route('profile', 'update-user-password')!, updatePassword.form)

    api.dispatch(success(response.message))
  } catch (e) {
    const error = e as AxiosError

    if (error.response?.status === 422) {
      const { errors: es } = error.response?.data as ValidationErrorResponse
      
      es.forEach(error => {
        const field = error.field as keyof typeof initialState.errors
        const message = error.message

        api.dispatch(setError({
          key: field, value: message,
        }))
      })
    } else {
      return api.rejectWithValue(e)
    }
    
  }
})

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setForm: (state: State, action: PayloadAction<{ key: keyof typeof initialState.form, value: any }>) => {
      state.form[action.payload.key] = action.payload.value
    },
    setError: (state: State, action: PayloadAction<{ key: keyof typeof initialState.errors, value: string }>) => {
      state.errors[action.payload.key] = action.payload.value
    },
    toggleProcessing: (state: State) => {
      state.processing = ! state.processing
    },
  },

  extraReducers: builder => {
    builder.addCase(update.pending, (state: State) => {
      state.processing = true

      state.errors.current_password = ''
      state.errors.password = ''
      state.errors.password_confirmation = ''
    })

    builder.addCase(update.fulfilled, (state: State) => {
      state.processing = false

      state.form.current_password = 
      state.form.password = ''
      state.form.password_confirmation = ''
    })

    builder.addCase(update.rejected, (state: State) => {
      state.processing = false

      state.form.current_password = 
      state.form.password = ''
      state.form.password_confirmation = ''
    })
  },
})

export const { setForm, setError, toggleProcessing } = slice.actions

export default slice.reducer
