import { getTodosByUserId } from '@/actions/todo'
import { getUserById } from '@/actions/user'
import { auth } from '@/auth'
import Auth from '@/components/Auth'
import Logo from '@/components/Logo'
import TodosList from '@/components/TodosList'
import { Card } from '@/components/ui/card'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

export default async function Home() {
  const session = await auth()
  const id = session?.user?.id!

  const queryClient = new QueryClient()
  const user = await queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: () => getUserById(id),
    staleTime: 60 * 1000,
  })

  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const data = await getTodosByUserId(id)
      if (data.success) {
        return data.data
      } else {
        throw new Error('Something went wrong, please try again later.')
      }
    },
    staleTime: 60 * 1000,
  })

  return (
    <SessionProvider>
      <main className='flex flex-col justify-top items-center p-5 w-full h-full'>
        <div className='flex flex-col w-full min-w-[350px] max-w-[550px] md:max-w-none lg:max-w-[1024px] h-full'>
          <div className='flex justify-between mb-4'>
            <Logo />
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Auth />
            </HydrationBoundary>
          </div>
          <Card className='mb-8 w-full'>
            <TodosList userId={id} />
          </Card>
        </div>
      </main>
    </SessionProvider>
  )
}
