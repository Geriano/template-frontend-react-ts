import axios, { AxiosError } from "axios";
import classNames from "classnames";
import React, { useRef, useState } from "react";
import Button from "../../../Components/Button";
import Card from "../../../Components/Card";
import Input from "../../../Components/Input";
import { useAppDispatch } from "../../../hooks";
import { route } from "../../../service";
import { User, ValidationErrorResponse } from "../../../Services/auth";
import { relog } from "../../../Slices/auth";
import { success } from "../../../Slices/flash";

interface Props {
  user: User
}

export default function GeneralInformation({ user }: Props) {
  const dispatch = useAppDispatch()
  const [processing, setProcessing] = useState(false)

  const file = useRef<HTMLInputElement|null>(null)

  const [form, setForm] = useState({
    photo: null as File|null,
    name: user.name,
    username: user.username,
    email: user.email,
  })

  const [errors, setErrors] = useState({
    photo: '',
    name: '',
    username: '',
    email: '',
  })

  const changeOrRemoveProfilePhoto = async (e: React.MouseEvent) => {
    if (user.profile_photo_url) {
      try {
        const { data: response } = await axios.delete(route('profile', 'remove-profile-photo')!)
        
        dispatch(success(response.message))
        dispatch(relog())

        setForm({
          ...form, photo: null
        })
      } catch (e) {
        console.log(e)
      }
    } else {
      if (form.photo) {
        setForm({
          ...form,
          photo: null,
        })
      } else {
        file.current?.click()
      }
    }
  }

  const displayTemporaryImage = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement
    setForm({
      ...form, photo: target.files![0],
    })
  }

  const input = (key: 'name'|'username'|'email', e: React.FormEvent) => {
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
      const { data: response } = await axios.patch(route('profile', 'update-user-general-information')!, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      
      dispatch(success(response.message))
      dispatch(relog())
      setErrors({
        photo: '',
        name: '',
        email: '',
        username: '',
      })
    } catch (e) {
      const error = e as AxiosError
      if (error.response?.status === 422) {
        const { errors: es } = error.response?.data as ValidationErrorResponse
        const entries = Object.fromEntries(es.map(error => [error.field, error.message]))
        console.log(entries)
        setErrors({
          photo: '',
          name: '',
          email: '',
          username: '',
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
          general information
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
                <div className="relative flex items-center justify-center w-28 h-28 border dark:border-gray-700 rounded-full">
                  { !form.photo && user.profile_photo_url && <img src={route('profile', 'photo', { path: user.profile_photo_url })} alt={user.name} className="w-full h-full object-cover object-center rounded-full" /> }
                  { form.photo && <img src={URL.createObjectURL(form.photo)} alt={user.name} className="w-full h-full object-cover object-center rounded-full" /> }
                  { (form.photo === null && (user.profile_photo_url === null || user.profile_photo_url === '')) && <i className="mdi mdi-account text-5xl font-bold"></i> }

                  <i 
                    onClick={changeOrRemoveProfilePhoto}
                    className={classNames("absolute right-0 bottom-0 mdi text-lg px-2 py-1 rounded-full bg-opacity-80 backdrop-blur-sm transition-all duration-300 cursor-pointer", {
                      'bg-red-500 mdi-delete': form.photo || user.profile_photo_url,
                      'bg-blue-500 mdi-sync': !form.photo && !user.profile_photo_url,
                    })} 
                  />
                </div>

                <p className="text-red-500 text-right text-sm">{errors.photo}</p>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <label htmlFor="name" className="flex-none w-1/4 capitalize">
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

                <p className="text-red-500 text-right text-sm">{errors.name}</p>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <label htmlFor="username" className="flex-none w-1/4 capitalize">
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

                <p className="text-red-500 text-right text-sm">{errors.username}</p>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <label htmlFor="email" className="flex-none w-1/4 capitalize">
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

                <p className="text-red-500 text-right text-sm">{errors.email}</p>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </>
  )
}