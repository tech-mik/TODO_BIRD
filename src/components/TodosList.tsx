'use client'

import { getTodosByUserId } from '@/actions/todo'
import Todo from '@/components/Todo'
import HandleTodosProvider from '@/context/HandleTodosContext'
import { CircleNotch } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import AddTodoForm from './AddTodoForm'
import EmptyTodo from './EmptyTodo'
import { CardContent, CardHeader } from './ui/card'

export default function TodosList({ userId }: { userId: string }) {
  // Load todo's
  const {
    data,
    error: queryError,
    isLoading,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const data = await getTodosByUserId(userId)

      if (data.success) {
        return data.data
      } else {
        throw new Error('Something went wrong, please try again later.')
      }
    },
    throwOnError: true,
    staleTime: 10000,
  })

  if (queryError) {
    throw new Error(queryError.message)
  }

  if (isLoading) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <CircleNotch size={32} className='animate-ping' />
      </div>
    )
  }

  return (
    <HandleTodosProvider>
      <CardHeader className='p-2 sm:p-6'>
        <AddTodoForm userId={userId} />
      </CardHeader>

      <CardContent className='p-2 pt-0 sm:p-6 sm:pt-0 flex flex-col items-center justify-start gap-1'>
        {data?.length ? (
          data?.map((todo) => <Todo todo={todo} key={todo.id} />)
        ) : (
          <EmptyTodo />
        )}
      </CardContent>
    </HandleTodosProvider>
  )
}
