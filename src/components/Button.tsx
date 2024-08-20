import { VariantProps } from 'class-variance-authority'
import { buttonVariants, Button as ShadButton } from '@/components/ui/button'
import { ArrowsClockwise } from '@phosphor-icons/react'

interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  asChild?: boolean
  isLoading?: boolean
}

export function Button({
  children,
  asChild,
  isLoading,
  ...props
}: IButtonProps) {
  return (
    <ShadButton className='relative justify-center' {...props}>
      <span className={`${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      <ArrowsClockwise
        className={`absolute h-4 w-4 animate-spin ${
          isLoading ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </ShadButton>
  )
}
