import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import route from "../route"
import { User } from "../Services/auth"
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
    api.rejectWithValue(error.response)
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
    api.rejectWithValue(e)
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
})

export const { setFromUser, setForm, setError, toggleProcessing, reset } = slice.actions

export default slice.reducer
