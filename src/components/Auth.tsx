import { SignOut } from '@phosphor-icons/react/dist/ssr'
import { signOut } from 'next-auth/react'
import AuthButton from './AuthButton'
import AuthInfo from './AuthInfo'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { auth } from '@/auth'

export default async function Auth() {
  const session = await auth()

  const id = session!.user!.id!

  return (
    <div className='flex gap-1 border rounded-xl bg-gray-50 shadow-sm p-1'>
      <AuthButton onClick={signOut} className='w-12 h-full cursor-pointer'>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <SignOut width={20} height={20} />
            </TooltipTrigger>
            <TooltipContent side='right'>Sign out</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AuthButton>
      <AuthButton className='pr-2'>
        <AuthInfo id={id} />
      </AuthButton>
    </div>
  )
}
