import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Flash {
  type: 'success'|'error'|'info'|'warning'
  message: string
}

interface State {
  value: Flash[]
}

export const name = 'flash'
export const initialState: State = {
  value: []
}

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    push: (state: State, action: PayloadAction<Flash>) => {
      state.value.push(action.payload)
    },

    success: (state: State, action: PayloadAction<string>) => {
      state.value.push({
        type: 'success',
        message: action.payload,
      })
    },

    error: (state: State, action: PayloadAction<string>) => {
      state.value.push({
        type: 'error',
        message: action.payload,
      })
    },

    warning: (state: State, action: PayloadAction<string>) => {
      state.value.push({
        type: 'warning',
        message: action.payload,
      })
    },

    info: (state: State, action: PayloadAction<string>) => {
      state.value.push({
        type: 'info',
        message: action.payload,
      })
    },

    remove: (state: State, action: PayloadAction<number>) => {
      state.value = state.value.filter((_, i) => i !== action.payload)
    },
  },
})

export const { push, success, error, info, warning, remove } = slice.actions

export default slice.reducer