import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Card from "../../Components/Card";
import { login, setForm } from "../../Slices/login";
import FloatingInput from "../../Components/FloatingInput";

export default function Login() {
  const { form, errors, processing } = useAppSelector(state => state.login)
  const dispatch = useAppDispatch()
  
  const input = (key: 'username'|'password', e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement
    dispatch(setForm({ key, value }))
  }

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatch(login())
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <Card
        header={
          <div className="flex items-center justify-center py-6">
            <h1 className="text-5xl font-semibold">Login</h1>
          </div>
        }
        footer={
          <div className="flex items-center justify-end px-2 py-1 rounded-b-md">
            <button className="bg-primary-0 text-gray-50 px-6 py-2 rounded-md capitalize text-sm">
              <div className="flex items-center space-x-1">
                { processing ? <i className="mdi mdi-loading animate-spin"></i> : <i className="mdi mdi-check"></i> }
                <p className="capitalize font-semibold">
                  login
                </p>
              </div>
            </button>
          </div>
        }
      >
        <div className="flex flex-col space-y-2 py-4 px-6">
          <FloatingInput
            label="Username"
            onInput={e => input('username', e)}
            value={form.username}
            type="text"
            name="username"
            autoFocus
          />

          { errors.username && <p className="text-right text-danger-0 text-sm">{errors.username}</p> }
          
          <FloatingInput
            label="Password"
            onInput={e => input('password', e)}
            value={form.password}
            type="password"
            name="password"
          />

          { errors.password && <p className="text-right text-danger-0 text-sm">{errors.password}</p> }
        </div>
      </Card>
    </form>
  )
}