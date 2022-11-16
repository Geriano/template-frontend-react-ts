import { useAppDispatch, useAppSelector } from "./hooks"

export default () => {
  const { user } = useAppSelector(state => state.auth)

  return (
    <div className="flex flex-col space-y-2">
      <div className="text-3xl">
        Hi <span className="capitalize">{ user.name }</span>!, Welcome back
      </div>
    </div>
  )
}
