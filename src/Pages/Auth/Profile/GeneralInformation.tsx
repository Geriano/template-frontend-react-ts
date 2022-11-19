import axios, { AxiosError } from "axios";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import Button from "../../../Components/Button";
import Card from "../../../Components/Card";
import Input from "../../../Components/Input";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { route } from "../../../route";
import { User, ValidationErrorResponse } from "../../../Services/auth";
import { relog } from "../../../Slices/auth";
import { success } from "../../../Slices/flash";
import { removeProfilePhoto, setForm, setFromUser, update } from "../../../Slices/generalInformation";

interface Props {
  user: User
}

export default function GeneralInformation({ user }: Props) {
  const { form, errors, processing } = useAppSelector(state => state.generalInformation)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setFromUser(user))
  }, [])

  const file = useRef<HTMLInputElement|null>(null)

  const changeOrRemoveProfilePhoto = (e: React.MouseEvent) => {
    if (user.profile_photo_url) {
      dispatch(removeProfilePhoto())
    } else {
      form.photo === null ? file.current?.click() : dispatch(setForm({
        key: 'photo',
        value: null,
      }))
    }
  }

  const displayTemporaryImage = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement
    const files = target.files as FileList

    dispatch(setForm({
      key: 'photo',
      value: files[0],
    }))
  }

  const input = (key: 'name'|'username'|'email', e: React.FormEvent) => {
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
          general information
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
              <div className="flex flex-col space-y-2 items-center justify-center pb-4">
                <input ref={file} onChange={displayTemporaryImage} type="file" className="hidden" />
                <div className="relative flex items-center justify-center w-20 h-20 border dark:border-gray-700 rounded-full">
                  { !form.photo && user.profile_photo_url && <img src={route('profile', 'photo', { path: user.profile_photo_url })} alt={user.name} className="w-full h-full object-cover object-center rounded-full" /> }
                  { form.photo && <img src={URL.createObjectURL(form.photo)} alt={user.name} className="w-full h-full object-cover object-center rounded-full" /> }
                  { (form.photo === null && (user.profile_photo_url === null || user.profile_photo_url === '')) && <i className="mdi mdi-account text-3xl font-bold"></i> }

                  <i 
                    onClick={changeOrRemoveProfilePhoto}
                    className={classNames("absolute right-0 bottom-0 mdi px-2 py-1 rounded-full bg-opacity-80 backdrop-blur-sm transition-all duration-300 cursor-pointer text-white dark:text-gray-700 shadow", {
                      'bg-danger-0 mdi-delete': form.photo || user.profile_photo_url,
                      'bg-primary-0 hover:bg-primary-1 mdi-sync': !form.photo && !user.profile_photo_url,
                    })} 
                  />
                </div>

                <p className="text-danger-0 text-right text-sm">{errors.photo}</p>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <label htmlFor="name" className="flex-none w-1/4 lowercase first-letter:capitalize text-sm">
                    name
                  </label>

                  <Input
                    onInput={e => input('name', e)}
                    value={form.name}
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="dark:border-gray-700"
                    required={false}
                  />
                </div>

                <p className="text-danger-0 text-right text-sm">{errors.name}</p>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <label htmlFor="username" className="flex-none w-1/4 lowercase first-letter:capitalize text-sm">
                    username
                  </label>

                  <Input
                    onInput={e => input('username', e)}
                    value={form.username}
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="dark:border-gray-700"
                    required={false}
                  />
                </div>

                <p className="text-danger-0 text-right text-sm">{errors.username}</p>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <label htmlFor="email" className="flex-none w-1/4 lowercase first-letter:capitalize text-sm">
                    email
                  </label>

                  <Input
                    onInput={e => input('email', e)}
                    value={form.email}
                    type="email"
                    name="email"
                    placeholder="Username"
                    className="dark:border-gray-700"
                    required={false}
                  />
                </div>

                <p className="text-danger-0 text-right text-sm">{errors.email}</p>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </>
  )
}