import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks";
import { login } from "../../Slices/auth";
import Card from "../../Components/Card";
import Input from "../../Components/Input";
import { RequestRejected, ValidationErrorResponse } from "../../Services/auth";
import classNames from "classnames";

export default function () {
  const dispatch = useAppDispatch()

  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  })

  const [processing, setProcessing] = useState(false)

  const input = (name: 'username'|'password', e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement
    setForm({
      ...form,
      [name]: value,
    })
  }

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setProcessing(true)

    dispatch(login({
      username: form.username, 
      password: form.password,
    }))
      .unwrap()
      .catch((e: RequestRejected) => {
        if (e.code === 422) {
          const { errors: es } = e.data as ValidationErrorResponse
          const entries = Object.fromEntries(es.map(error => [error.field, error.message]))
          setErrors({
            username: entries.username || '',
            password: entries.password || '',
          })
        }
      })
      .finally(() => setProcessing(false))
  }

  return (
    <>
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
            <label htmlFor="username" className="capitalize">
              username
            </label>

            <Input
              onInput={e => input('username', e)}
              type="text"
              name="username"
              placeholder="Username"
              className={classNames("dark:border-gray-700", {
                'outline outline-1 outline-danger-0 focus:outline-danger-0': errors.username
              })}
              autoFocus
              required
            />

            { errors.username && <p className="text-right text-danger-0 text-sm">{errors.username}</p> }

            <label htmlFor="password" className="capitalize">
              password
            </label>

            <Input
              onInput={e => input('password', e)}
              type="password"
              name="password"
              placeholder="Password"
              className={classNames("dark:border-gray-700", {
                'outline outline-1 outline-danger-0 focus:outline-danger-0': errors.password
              })}
              required
            />

            { errors.password && <p className="text-right text-danger-0 text-sm">{errors.password}</p> }
          </div>
        </Card>
      </form>
    </>
  )
}