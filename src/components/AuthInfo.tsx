'use client'

import { getUserById } from '@/actions/user'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useQuery } from '@tanstack/react-query'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function AuthInfo({ id }: { id: string }) {
  const { data, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUserById(id),
  })

  return (
    <>
      <Avatar>
        <AvatarImage
          width={10}
          height={10}
          src={data?.data?.image || '/no-profile.jpg'}
        />
      </Avatar>
      {/* <Image
            src={session?.user?.image || '/no-profile.jpg'}
            width={30}
            height={30}
            alt='Mik ten Holt'
            className='rounded-full'
          /> */}
      <span className=''>{data?.data?.name || data?.data?.email}</span>
      {/* <CaretDown width={16} height={16} /> */}
    </>
  )
}
