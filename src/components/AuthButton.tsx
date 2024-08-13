'use client'

import Link from 'next/link'

interface BaseAuthButtonProps {
  children: React.ReactNode
  className?: string
  isLink?: boolean
}

interface AuthButtonWithLink extends BaseAuthButtonProps {
  isLink: true
  href: string // href is required when link is true
  onClick?: never
}

interface AuthButtonWithoutLink extends BaseAuthButtonProps {
  isLink?: false
  href?: never // href is not allowed when link is false
  onClick?: () => void
}

type AuthButtonProps = AuthButtonWithLink | AuthButtonWithoutLink

export default function AuthButton({
  children,
  href,
  className,
  isLink = false,
  onClick,
}: AuthButtonProps) {
  // A LINK
  if (isLink) {
    return (
      <Link
        href={href as string}
        className={`bg-white rounded-xl gap-2 p-1 shadow-sm justify-center flex border items-center hover:shadow-none hover:bg-gray-50/5 ${
          className ? className : ''
        }`}>
        {children}
      </Link>
    )
  }

  // NOT A LINK
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl gap-2 p-1 shadow-sm justify-center flex border items-center ${
        className ? className : ''
      }`}>
      {children}
    </div>
  )
}
