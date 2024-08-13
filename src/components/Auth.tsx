import { SignOut } from '@phosphor-icons/react/dist/ssr'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import AuthButton from './AuthButton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { auth } from '@/auth'
import { Avatar, AvatarFallback } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'

export default async function Auth() {
  const session = await auth()

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
        <Avatar>
          <AvatarImage src={session?.user?.image || '/no-profile.jpg'} />
        </Avatar>
        {/* <Image
          src={session?.user?.image || '/no-profile.jpg'}
          width={30}
          height={30}
          alt='Mik ten Holt'
          className='rounded-full'
        /> */}
        <span className=''>{session?.user?.name}</span>
        {/* <CaretDown width={16} height={16} /> */}
      </AuthButton>
    </div>
  )
}
