import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import route from "../route"
import { User, ValidationErrorResponse } from "../Services/auth"
import { RootState } from "../store"
import { relog } from "./auth"
import { success } from "./flash"

interface State {
  processing: boolean
  form: {
    photo: File|null
    name: string
    email: string
    username: string
  }
  errors: {
    photo: string
    name: string
    email: string
    username: string
  }
}

export const name = 'generalInformation'

export const initialState: State = {
  processing: false,
  form: {
    photo: null,
    name: '',
    email: '',
    username: '',
  },
  errors: {
    photo: '',
    name: '',
    email: '',
    username: '',
  },
}

export const removeProfilePhoto = createAsyncThunk('removePhotoProfile', async (_, api) => {
  try {
    const { data: response } = await axios.delete(route('profile', 'remove-profile-photo')!)

    api.dispatch(success(response.message))
    api.dispatch(relog())
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
    }
    
    api.rejectWithValue(e)
  }
})

export const update = createAsyncThunk('update', async (_, api) => {
  const { generalInformation } = api.getState() as RootState

  try {
    const { data: response } = await axios.patch(route('profile', 'update-user-general-information')!, generalInformation.form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    api.dispatch(success(response.message))
    api.dispatch(relog())
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
    setFromUser: (state: State, action: PayloadAction<User>) => {
      state.form.name = action.payload.name
      state.form.email = action.payload.email
      state.form.username = action.payload.username
    },
    setForm: (state: State, action: PayloadAction<{ key: keyof typeof initialState.form, value: any }>) => {
      state.form[action.payload.key] = action.payload.value
    },
    setError: (state: State, action: PayloadAction<{ key: keyof typeof initialState.errors, value: string }>) => {
      state.errors[action.payload.key] = action.payload.value
    },
    toggleProcessing: (state: State) => {
      state.processing = ! state.processing
    },
    reset: (state: State) => {
      state.processing = false
      state.form.photo = null
      state.form.name = ''
      state.form.email = ''
      state.form.username = ''
      state.errors.photo = ''
      state.errors.name = ''
      state.errors.email = ''
      state.errors.username = ''
    },
  },
  extraReducers: builder => {
    builder.addCase(removeProfilePhoto.pending, (state: State) => {
      state.processing = true
    })

    builder.addCase(removeProfilePhoto.fulfilled, (state: State) => {
      state.processing = false
    })

    builder.addCase(removeProfilePhoto.rejected, (state: State) => {
      state.processing = false
    })

    builder.addCase(update.pending, (state: State) => {
      state.processing = true
    })

    builder.addCase(update.fulfilled, (state: State) => {
      state.processing = false
    })

    builder.addCase(update.rejected, (state: State) => {
      state.processing = false
    })
  },
})

export const { setFromUser, setForm, setError, toggleProcessing, reset } = slice.actions

export default slice.reducer
