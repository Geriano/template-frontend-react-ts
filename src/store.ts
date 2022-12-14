import { configureStore } from "@reduxjs/toolkit"
import auth from "./Slices/auth"
import modal from "./Slices/modal"
import flash from "./Slices/flash"
import login from "./Slices/login"
import generalInformation from "./Slices/generalInformation"
import updatePassword from "./Slices/updatePassword"

export const store = configureStore({
  reducer: {
    auth,
    modal,
    flash,
    login,
    generalInformation,
    updatePassword,
  },
  middleware: middleware => middleware({
    serializableCheck: false,
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
