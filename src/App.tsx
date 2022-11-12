import Button from "./Components/Button"
import Modal from "./Components/Modal"
import { useAppDispatch, useAppSelector } from "./hooks"
import { push } from "./Slices/modal"

export default () => {
  const { user } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  const show = () => {
    const click = () => {
      dispatch(push(
        <Modal>
          <h1 className="text-7xl text-red-500">Second</h1>
        </Modal>
      ))
    }
    dispatch(push(
      <Modal>
        <h1 onClick={click}>Hello World</h1>
      </Modal>
    ))
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="text-3xl">
        Hi <span className="capitalize">{ user.name }</span>!, Welcome back
      </div>

      <div className="flex items-center">
        <Button onClick={show}>
          show
        </Button>
      </div>
    </div>
  )
}
