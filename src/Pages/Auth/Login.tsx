import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { route } from "../../service";
import { login } from "../../Slices/auth";
import Card from "../../Components/Card";
import Input from "../../Components/Input";
import { useState } from "react";

export default function () {
  const dispatch = useAppDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const input = (name: string, e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement
    
    switch(name) {
      case 'username':
        return setUsername(value)
      case 'password':
        return setPassword(value)
    }
  }

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(login({ username, password }))
  }

  return (
    <>
      <h1 className="text-5xl font-semibold">Login</h1>

      <form onSubmit={submit} className="w-full max-w-md">
        <Card
          footer={
            <div className="flex items-center justify-end px-2 py-1 rounded-b-md">
              <button className="bg-green-500 px-3 py-1 rounded-md capitalize">
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
              onInput={e => input('username', e)}
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
              onInput={e => input('password', e)}
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