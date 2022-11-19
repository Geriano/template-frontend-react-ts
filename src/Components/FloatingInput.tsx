import React from "react"

interface Props {
  label: string
  type?: string
  name?: string
  value?: any
  autoFocus?: boolean
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void
}

export default function FloatingInput(props: Props) {
  return (
    <div className="relative">
      <input 
        {...props}
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
        placeholder=" " 
      />
      <label className="absolute text-sm dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 rounded-full px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
        {props.label}
      </label>
  </div>
  )
}