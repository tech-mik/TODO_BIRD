import { getTodosByUserId } from '@/actions/todo'
import { getUserById } from '@/actions/user'
import { auth } from '@/auth'
import Auth from '@/components/Auth'
import TodosList from '@/components/TodosList'
import { Card } from '@/components/ui/card'
import { Bird } from '@phosphor-icons/react/dist/ssr'
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
  await queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: () => getUserById(id),
    staleTime: 60 * 1000,
  })

  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: () => getTodosByUserId(id),
    staleTime: 60 * 1000,
  })

  return (
    <SessionProvider>
      <main className='w-full h-full flex flex-col justify-top items-center p-6'>
        <div className='flex flex-col w-[800px] h-full'>
          <div className='flex justify-between mb-4'>
            <div className='text-4xl font-bold flex items-center font-mono text-gray-700'>
              <Bird
                className='text-blue-600 mr-2 animate-bounce'
                weight='fill'
              />
              TODO_BIRD
            </div>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Auth />
            </HydrationBoundary>
          </div>
          <Card className='w-full mb-8'>
            <TodosList userId={id} />
          </Card>
        </div>
      </main>
    </SessionProvider>
  )
}
