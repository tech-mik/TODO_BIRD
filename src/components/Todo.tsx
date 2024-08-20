'use client'

import { deleteTodo, toggleTodoCompleted } from '@/actions/todo'
import { Checkbox } from '@/components/ui/checkbox'
import {
  HandleTodosContext,
  IHandleTodosContext,
} from '@/context/HandleTodosContext'
import { TTodo } from '@/types/todos'
import { Trash } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'

interface ITodoProps {
  todo: TTodo & { isLoading?: boolean }
}

export default function Todo({ todo }: ITodoProps) {
  const queryClient = useQueryClient()
  const { removeTodo } = useContext(HandleTodosContext) as IHandleTodosContext

  /**
   * Delete todo mutation
   */
  const { mutate: deleteTodoMutation } = useMutation({
    mutationKey: ['todos'],
    mutationFn: (todo) => deleteTodo(todo),
    onError: (error) => {
      toast.error(error.message)
    },
    onMutate: async (todo: TTodo) => {
      // Cancel queries to prevent UI from updating during optimistic update
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      // Get previous todo
      const previousTodos = queryClient.getQueryData<TTodo[]>(['todos'])

      // Update state, delete todo from UI
      queryClient.setQueryData(['todos'], removeTodo({ todo, previousTodos }))
    },

    onSettled: (data, error, variables, context) => {
      toast.success('Todo deleted successfully')

      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  /**
   * Toggle todo mutation
   */
  const { mutate: toggleTodoMutation } = useMutation({
    mutationKey: ['todos'],
    mutationFn: toggleTodoCompleted,
    onMutate: async (oldTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData(['todos'])

      queryClient.setQueryData<TTodo[]>(['todos'], (old) => {
        return old?.map((t) => {
          if (t.id === oldTodo.id) {
            return { ...t, completed: !t.completed }
          }
          return t
        })
      })

      return { previousTodos }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos)
    },
  })

  return (
    <div
      key={todo.id}
      className={`flex items-center justify-between bg-secondary w-full p-3 rounded-lg ${
        todo.isLoading ? 'animate-pulse' : ''
      }`}>
      <div className='flex justify-start items-center gap-3'>
        <Checkbox
          onCheckedChange={() => toggleTodoMutation(todo)}
          checked={todo.completed}
        />
        <span className={`${todo.completed ? 'line-through' : ''}`}>
          {' '}
          {todo.text}
        </span>
      </div>
      <Button
        disabled={todo.isLoading}
        type='button'
        variant={'destructive'}
        className='px-3'
        onClick={() => deleteTodoMutation(todo)}>
        <Trash />
      </Button>
    </div>
  )
}
