import { Bird } from '@phosphor-icons/react/dist/ssr'

export default function Logo() {
  return (
    <div className='text-4xl font-bold flex items-center font-mono text-gray-700'>
      <Bird className='text-blue-600 mr-2 animate-bounce ' weight='fill' />
      <span className='hidden sm:block'>TODO_BIRD</span>
    </div>
  )
}
