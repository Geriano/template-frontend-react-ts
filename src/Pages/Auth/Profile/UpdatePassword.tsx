import axios, { AxiosError } from "axios";
import classNames from "classnames";
import React, { useState } from "react";
import Button from "../../../Components/Button";
import Card from "../../../Components/Card";
import Input from "../../../Components/Input";
import { useAppDispatch } from "../../../hooks";
import { route } from "../../../service";
import { User, ValidationErrorResponse } from "../../../Services/auth";
import { success } from "../../../Slices/flash";

interface Props {
  user: User
}

export default function UpdatePassword({ user }: Props) {
  const dispatch = useAppDispatch()
  const [processing, setProcessing] = useState(false)

  const [form, setForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const [errors, setErrors] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const input = (key: 'current_password'|'password'|'password_confirmation', e: React.FormEvent) => {
    const target = e.target as HTMLInputElement
    setForm({
      ...form,
      [key]: target.value
    })
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (processing) {
      return
    }

    setProcessing(true)
    
    try {
      const { data: response } = await axios.patch(route('profile', 'update-user-password')!, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      
      dispatch(success(response.message))
      setErrors({
        current_password: '',
        password: '',
        password_confirmation: '',
      })
      setForm({
        current_password: '',
        password: '',
        password_confirmation: '',
      })
    } catch (e) {
      const error = e as AxiosError
      if (error.response?.status === 422) {
        const { errors: es } = error.response?.data as ValidationErrorResponse
        const entries = Object.fromEntries(es.map(error => [error.field, error.message]))

        setErrors({
          current_password: '',
          password: '',
          password_confirmation: '',
          ...entries,
        })
      }
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      <div className="col-span-full md:col-span-5">
        <h1 className="text-xl font-semibold capitalize">
          update password
        </h1>
      </div>

      <div className="col-span-full md:col-span-7">
        <form onSubmit={submit}>
          <Card
            footer={
             <div className="flex items-center justify-end px-2 py-1">
              <Button 
                type="submit"
                className="bg-gray-600 hover:bg-gray-700 dark:hover:bg-gray-800"
              >
                <i className={classNames("mdi", {
                  'mdi-loading animate-spin': processing,
                  'mdi-check': !processing,
                })}></i>

                <p className="capitalize font-semibold">
                  update
                </p>
              </Button>
             </div>
            }
          >
            <div className="flex flex-col space-y-2 p-4">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <label htmlFor="current_password" className="flex-none w-1/4 lowercase first-letter:capitalize">
                    Current Password
                  </label>

                  <Input
                    onInput={e => input('current_password', e)}
                    value={form.current_password}
                    type="password"
                    name="current_password"
                    placeholder="Current password"
                    className="dark:border-gray-700"
                    required={false}
                  />
                </div>

                <p className="text-red-500 text-right text-sm">{errors.current_password}</p>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <label htmlFor="password" className="flex-none w-1/4 lowercase first-letter:capitalize">
                    new password
                  </label>

                  <Input
                    onInput={e => input('password', e)}
                    value={form.password}
                    type="password"
                    name="password"
                    placeholder="New password"
                    className="dark:border-gray-700"
                    required={false}
                  />
                </div>

                <p className="text-red-500 text-right text-sm">{errors.password}</p>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <label htmlFor="password_confirmation" className="flex-none w-1/4 lowercase first-letter:capitalize">
                    password confirmation
                  </label>

                  <Input
                    onInput={e => input('password_confirmation', e)}
                    value={form.password_confirmation}
                    type="password"
                    name="password_confirmation"
                    placeholder="Password confirmation"
                    className="dark:border-gray-700"
                    required={false}
                  />
                </div>

                <p className="text-red-500 text-right text-sm">{errors.password_confirmation}</p>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </>
  )
}