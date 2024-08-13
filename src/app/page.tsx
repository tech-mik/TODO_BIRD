import { auth } from '@/auth'
import Auth from '@/components/Auth'
import Todos from '@/components/Todos'
import { Bird } from '@phosphor-icons/react/dist/ssr'

export default async function Home() {
  const session = await auth()

  return (
    <main className='w-full h-full flex flex-col justify-top items-center p-6'>
      <div className='flex flex-col w-[800px]'>
        <div className='flex justify-between mb-4'>
          <div className='text-4xl font-bold flex items-center font-mono text-gray-700'>
            <Bird className='text-blue-600 mr-2 animate-bounce' weight='fill' />
            TODO_BIRD
          </div>
          <Auth />
        </div>
        <Todos />
      </div>
    </main>
  )
}
