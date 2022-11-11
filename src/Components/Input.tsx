import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'

interface Props {
  type?: 'text'|'password'|'number'|'file'|'date'|'datetime-local'|'color'
  name?: string
  placeholder?: string
  className?: string
  required?: boolean
  autoFocus?: boolean
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

export default function (props: Props) {
  const { className } = props

  return (
    <input 
      type="text"
      {...props}
      className={classNames("bg-transparent px-3 py-1 border rounded-md", className)}
    />
  )
}