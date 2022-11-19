import classNames from "classnames";
import React, { useState } from "react";
import Button from "../../../Components/Button";
import Card from "../../../Components/Card";
import FloatingInput from "../../../Components/FloatingInput";
import Input from "../../../Components/Input";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { User } from "../../../Services/auth";
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
              <div className="flex flex-col space-y-1 max-w-sm">
                <FloatingInput
                  onInput={e => input('current_password', e)}
                  value={form.current_password}
                  type="password"
                  name="current_password"
                  label="Current password"
                  required
                />

                <p className="text-danger-0 text-right text-sm">{errors.current_password}</p>
              </div>

              <div className="flex flex-col space-y-1 max-w-sm">
                <FloatingInput
                  onInput={e => input('password', e)}
                  value={form.password}
                  type="password"
                  name="password"
                  label="New password"
                  required
                />

                <p className="text-danger-0 text-right text-sm">{errors.password}</p>
              </div>

              <div className="flex flex-col space-y-1 max-w-sm">
                <FloatingInput
                  onInput={e => input('password_confirmation', e)}
                  value={form.password_confirmation}
                  type="password"
                  name="password_confirmation"
                  label="Password confirmation"
                  required
                />

                <p className="text-danger-0 text-right text-sm">{errors.password_confirmation}</p>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </>
  )
}