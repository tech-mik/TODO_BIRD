import { Sun } from '@phosphor-icons/react/dist/ssr'

export default function EmptyTodo() {
  return (
    <div className='flex items-center justify-between gap-3 bg-secondary w-full pl-3 pr-1 py-1 rounded-lg'>
      <div className='flex justify-start items-center gap-3'>
        <Sun /> Nothing todo today. Enjoy your day!
      </div>
    </div>
  )
}
