'use client'

import { createTodo } from '@/actions/todo'
import { Button } from '@/components/Button'
import {
  HandleTodosContext,
  IHandleTodosContext,
} from '@/context/HandleTodosContext'
import { insertTodoSchema } from '@/db/schemas/todos'
import { TNewTodo } from '@/types/todos'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Input } from './ui/input'

interface OptimisticNewTodo extends TNewTodo {
  isLoading?: boolean
}

export default function AddTodoForm({ userId }: { userId: string }) {
  const queryClient = useQueryClient()
  const { addTodo, removeTodo, updateTodo } = useContext(
    HandleTodosContext,
  ) as IHandleTodosContext

  // Instantiate React-Hook-Form instance
  const form = useForm({
    resolver: zodResolver(insertTodoSchema),
    defaultValues: {
      userId,
      text: '',
    },
  })

  // Create new todo mutation
  const { mutate: createTodoMutation } = useMutation({
    mutationKey: ['todos'],
    mutationFn: createTodo,
    throwOnError: true,
    onMutate: async (todo) => {
      // Reset form
      form.reset()
      form.setFocus('text')

      // Cancel the query to prevent the UI from updating
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      // Get the previous todos
      const previousTodos = queryClient.getQueryData<TNewTodo[]>(['todos'])

      const newTodo = {
        ...todo,
        isLoading: true,
      }

      // Update the cache with the new todo
      queryClient.setQueryData(
        ['todos'],
        addTodo({ todo: newTodo, previousTodos }),
      )

      return { previousTodos }
    },
    onSettled: async (data, error, variables, context) => {
      if (data?.error) {
        if (data.error.status === 500) {
          toast.error(data.error.errors[0].message)
        }
        if (data.error.status === 400) {
          form.setError(data.error.errors[0].path[0], {
            message: data.error.errors[0].message,
          })
        }

        queryClient.setQueryData(
          ['todos'],
          removeTodo({
            todo: variables,
            previousTodos: context?.previousTodos,
          }),
        )
      } else if (data?.success && data.data !== null) {
        updateTodo({
          todo: data.data,
          previousTodos: context?.previousTodos,
        })
        await queryClient.invalidateQueries({ queryKey: ['todos'] })
      } else {
        throw new Error('Something went wrong, please try again.')
      }
    },
  })

  // The submit handler with the React-Query mutation
  const onSubmit = (values: TNewTodo) => {
    const newTodo = {
      ...values,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }
    createTodoMutation(newTodo)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex gap-1 w-full justify-between'>
        <FormField
          name='text'
          control={form.control}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input
                  {...field}
                  value={field.value}
                  placeholder='Clean my room'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Add Todo</Button>
      </form>
    </Form>
  )
}
