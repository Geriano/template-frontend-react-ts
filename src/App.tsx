import { useDispatch, useSelector } from "react-redux"
import { route } from "./service"
import { RootState } from "./store"

export default () => {
  return (
    <>
      <h1 className="text-red-500 text-7xl text-center">
        { route('authentication', 'login') }
      </h1>
    </>
  )
}
