import axios, { AxiosError } from "axios";
import classNames from "classnames";
import React, { useState } from "react";
import Button from "../../../Components/Button";
import Card from "../../../Components/Card";
import Input from "../../../Components/Input";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { route } from "../../../route";
import { User, ValidationErrorResponse } from "../../../Services/auth";
import { success } from "../../../Slices/flash";
import { setForm, update } from "../../../Slices/updatePassword";

interface Props {
  user: User
}

export default function UpdatePassword({ user }: Props) {
  const { form, errors, processing } = useAppSelector(state => state.updatePassword)
  const dispatch = useAppDispatch()
  
  const input = (key: 'current_password'|'password'|'password_confirmation', e: React.FormEvent) => {
    const target = e.target as HTMLInputElement
    
    dispatch(setForm({
      key, value: target.value,
    }))
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (processing) {
      return
    }

    dispatch(update())
  }

  return (
    <>
      <div className="col-span-full md:col-span-4">
        <h1 className="text-xl font-semibold capitalize">
          update password
        </h1>
      </div>

      <div className="col-span-full md:col-span-8">
        <form onSubmit={submit}>
          <Card
            footer={
             <div className="flex items-center justify-end px-2 py-1">
              <Button 
                type="submit"
                className="bg-success-0 hover:bg-success-1 text-white py-2 px-6"
                disabled={processing}
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
                  <label htmlFor="current_password" className="flex-none w-1/4 lowercase first-letter:capitalize text-sm">
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

                <p className="text-danger-0 text-right text-sm">{errors.current_password}</p>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <label htmlFor="password" className="flex-none w-1/4 lowercase first-letter:capitalize text-sm">
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

                <p className="text-danger-0 text-right text-sm">{errors.password}</p>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <label htmlFor="password_confirmation" className="flex-none w-1/4 lowercase first-letter:capitalize text-sm">
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

                <p className="text-danger-0 text-right text-sm">{errors.password_confirmation}</p>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </>
  )
}