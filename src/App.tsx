import { useAppSelector } from "./hooks"

export default () => {
  const { user } = useAppSelector(state => state.auth)

  return (
    <>
      <h1 className="text-red-500 text-7xl text-center">
        { user.name }
      </h1>
    </>
  )
}
