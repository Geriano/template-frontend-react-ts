import classNames from "classnames";
import React from "react";

interface Props {
  type?: 'button'|'submit',
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => any
}

export default function Button(props: React.PropsWithChildren<Props>) {
  return (
    <button
      type="button"
      {...props}
      className={classNames("px-3 py-1 rounded-md capitalize text-sm transition-all duration-300 shadow", props.className)}
    >
      <div className="flex items-center space-x-1">
        {props.children}
      </div>
    </button>
  )
}