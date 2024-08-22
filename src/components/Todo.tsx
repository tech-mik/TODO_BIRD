'use client'

import { editTodo, toggleTodoCompleted } from '@/actions/todo'
import { Checkbox } from '@/components/ui/checkbox'
import {
  HandleTodosContext,
  IHandleTodosContext,
} from '@/context/HandleTodosContext'
import { insertTodoSchema } from '@/db/schemas/todos'
import { TNewTodo, TTodo } from '@/types/todos'
import { zodResolver } from '@hookform/resolvers/zod'
import { FloppyDisk, X } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import TodoOptions from './TodoOptions'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem } from './ui/form'
import { Input } from './ui/input'
import { todo } from 'node:test'

interface ITodoProps {
  todo: TTodo & { isLoading?: boolean }
}

export default function Todo({ todo }: ITodoProps) {
  const [showForm, setShowForm] = useState(false)
  const { updateTodo } = useContext(HandleTodosContext) as IHandleTodosContext

  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(insertTodoSchema),
    defaultValues: { text: todo.text },
  })

  /**
   * Toggle todo mutation
   */
  const { mutate: toggleTodoMutation } = useMutation({
    mutationKey: ['todos'],
    mutationFn: toggleTodoCompleted,
    onMutate: async (oldTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData<TTodo[]>(['todos'])

      const newTodo = {
        ...oldTodo,
        completed: !oldTodo.completed,
      }

      queryClient.setQueryData(
        ['todos'],
        updateTodo({ todo: newTodo, previousTodos }),
      )

      return { oldTodo, previousTodos }
    },
    onSettled: async (data, error, variables, context) => {
      if (data?.error) {
        queryClient.setQueryData(
          ['todos'],
          updateTodo({
            todo: context?.oldTodo!,
            previousTodos: context?.previousTodos,
          }),
        )
      }
    },
  })

  /**
   * Edit todo mutation
   */
  const { mutate: editTodoMutation } = useMutation({
    mutationKey: ['todos'],
    mutationFn: editTodo,
    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData<TTodo[]>(['todos'])

      const newTodo = {
        ...updatedTodo,
        isLoading: true,
      }

      // Update the cache with the new todo
      queryClient.setQueryData(
        ['todos'],
        updateTodo({ todo: newTodo, previousTodos }),
      )

      setShowForm(false)

      return { originalTodo: todo, previousTodos }
    },
    onSettled: async (data, error, variables, context) => {
      if (data?.error) {
        queryClient.setQueryData(
          ['todos'],
          updateTodo({
            todo: context?.originalTodo!,
            previousTodos: context?.previousTodos,
          }),
        )
        setShowForm(true)
        toast.error('Something went wrong, please try again later.')
      } else if (data?.success && data.data !== null) {
        queryClient.setQueryData(
          ['todos'],
          updateTodo({
            todo: data.data,
            previousTodos: context?.previousTodos,
          }),
        )
      }
    },
  })

  function handleCancelEdit() {
    setShowForm(false)
    form.reset()
  }

  function onSubmit(value: TNewTodo) {
    const newTodo = { ...todo, text: value.text }

    editTodoMutation(newTodo)
  }

  return (
    <div
      key={todo.id}
      className={`flex items-center justify-between gap-1 bg-secondary w-full pl-3 pr-1 py-1 rounded-lg ${
        todo.isLoading ? 'animate-pulse' : ''
      }`}>
      <div className='flex justify-start items-center gap-3 w-full'>
        <Checkbox
          onCheckedChange={() => toggleTodoMutation(todo)}
          checked={todo.completed}
          disabled={todo.isLoading || showForm}
        />
        {showForm && (
          <Form {...form}>
            <form className='w-full' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='text'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input {...field} type='text' defaultValue={todo.text} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        {!showForm && (
          <span className={`${todo.completed ? 'line-through' : ''}`}>
            {' '}
            {todo.text}
          </span>
        )}
      </div>
      {showForm && (
        <>
          <Button
            className='bg-green-600 px-3'
            onClick={form.handleSubmit(onSubmit)}>
            <FloppyDisk />
          </Button>
          <Button
            variant='destructive'
            className='px-3'
            onClick={handleCancelEdit}>
            <X />
          </Button>
        </>
      )}
      {!showForm && (
        <TodoOptions
          todo={todo}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      )}
    </div>
  )
}
