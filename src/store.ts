import { configureStore } from "@reduxjs/toolkit"
import auth from "./Slices/auth"
import modal from "./Slices/modal"
import flash from "./Slices/flash"

export const store = configureStore({
  reducer: {
    auth,
    modal,
    flash,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
