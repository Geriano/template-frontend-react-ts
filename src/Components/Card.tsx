import React, { PropsWithChildren, ReactElement } from 'react'
import classNames from 'classnames'

interface Props {
  header?: ReactElement
  footer?: ReactElement
  className?: string
}

export default function (props: PropsWithChildren<Props>) {
  const { header, footer, className, children } = props

  return (
    <div className={classNames("bg-white dark:bg-gray-800 rounded-md h-full shadow dark:shadow-xl", className)}>
      { header && <div className='sticky top-0 w-full bg-gray-100 dark:bg-gray-700 rounded-t-md'>{header}</div> }
      <div className={classNames("w-full h-full", { "rounded-t-md": !header, "rounded-b-md": !footer })}>
        {children}
      </div>
      { footer && <div className='sticky bottom-0 w-full bg-gray-100 dark:bg-gray-700 rounded-b-md'>{footer}</div> }
    </div>
  )
}