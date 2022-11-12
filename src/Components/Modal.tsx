import React, { useEffect, useRef } from "react";
import { useAppDispatch } from "../hooks";
import { hide } from "../Slices/modal";

export default function Modal(props: React.PropsWithChildren) {
  const dispatch = useAppDispatch()

  const modal = useRef(null)

  const close = () => dispatch(hide())
  const click = (e: React.MouseEvent<HTMLDivElement>) => e.target === modal.current && close()
  const key = (e: KeyboardEvent) => e.key === 'Escape' && close()

  useEffect(() => {
    document.addEventListener('keydown', key)

    return () => document.removeEventListener('keydown', key)
  }, [])

  return (
    <div
      ref={modal}
      onClick={click}
      className="fixed top-0 left-0 w-full h-screen overflow-auto pt-20 bg-black bg-opacity-40 backdrop-blur-sm dark:text-gray-300"
    >
      {props.children}
    </div>
  )
}