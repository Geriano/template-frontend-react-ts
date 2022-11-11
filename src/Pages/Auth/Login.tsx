import Card from "../../Components/Card";
import Input from "../../Components/Input";
import { useForm } from "../../form";
import { route } from "../../service";
import { LoginSuccessResponse } from "../../Services/auth";

export default function () {
  const form = useForm({
    username: '',
    password: '',
  })

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await form.post<LoginSuccessResponse>(route('authentication', 'login')!)
      const {
        user, token
      } = response

      form.reset()
    } catch (e) {}
  }

  return (
    <>
      <h1 className="text-5xl font-semibold">Login</h1>

      <form onSubmit={submit} className="w-full max-w-md">
        <Card
          footer={
            <div className="flex items-center justify-end px-2 py-1 rounded-b-md">
              <button className="bg-green-500 px-3 py-1 rounded-md">
                login
              </button>
            </div>
          }
        >
          <div className="flex flex-col space-y-2 p-4">
            <label htmlFor="username" className="capitalize">
              username
            </label>

            <Input
              type="text"
              name="username"
              placeholder="Username"
              className="dark:border-gray-700"
              autoFocus
              required
            />

            {/* <p className="text-right text-red-500 text-sm">Username is required</p> */}

            <label htmlFor="password" className="capitalize">
              password
            </label>

            <Input
              type="password"
              name="password"
              placeholder="Password"
              className="dark:border-gray-700"
              required
            />

            {/* <p className="text-right text-red-500 text-sm">Wrong password</p> */}
          </div>
        </Card>
      </form>
    </>
  )
}