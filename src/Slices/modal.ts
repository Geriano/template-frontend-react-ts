import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import React from "react"

interface State {
  queue: JSX.Element[]
}

export const name = 'modal'
export const initialState: State = {
  queue: []
}

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    push: (state: State, action: PayloadAction<JSX.Element>) => {
      state.queue.push(action.payload)
    },

    pop: (state: State) => {
      state.queue.pop()
    },
  },
})

export const show = slice.actions.push
export const hide = slice.actions.pop
export const { push, pop } = slice.actions

export default slice.reducer
