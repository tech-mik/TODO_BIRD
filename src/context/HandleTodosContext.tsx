'use client'

import { TNewTodo, TTodo } from '@/types/todos'
import { createContext, useRef } from 'react'

type THandleTodo = (params: {
  todo: TNewTodo | TTodo
  previousTodos: TNewTodo[] | undefined
}) => TNewTodo[]

interface IUseOptimisticTodoProps {
  todo: TNewTodo | TTodo
  previousTodos?: TNewTodo[] | undefined
}

export interface IHandleTodosContext {
  addTodo: THandleTodo
  removeTodo: THandleTodo
  updateTodo: THandleTodo
}

export const HandleTodosContext = createContext<IHandleTodosContext | null>(
  null,
)

export default function HandleTodosProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const todos = useRef<TNewTodo[]>([])

  function addTodo({ todo, previousTodos }: IUseOptimisticTodoProps) {
    let newTodos

    if (todos.current.length === 0 && previousTodos) {
      newTodos = [todo, ...previousTodos]
    } else {
      newTodos = [todo, ...todos.current]
    }
    todos.current = newTodos

    return newTodos
  }

  function removeTodo({ todo, previousTodos }: IUseOptimisticTodoProps) {
    let newTodos

    if (todos.current.length === 0 && previousTodos) {
      newTodos = previousTodos.filter((t) => t.id !== todo.id)
    } else {
      newTodos = todos.current.filter((t) => t.id !== todo.id)
    }
    todos.current = newTodos

    return newTodos
  }

  function updateTodo({ todo, previousTodos }: IUseOptimisticTodoProps) {
    let newTodos

    if (todos.current.length === 0 && previousTodos) {
      newTodos = previousTodos.map((t) => {
        if (t.id === todo.id) return todo
        return t
      })
    } else {
      newTodos = todos.current.map((t) => {
        if (t.id === todo.id) return todo
        return t
      })
    }

    todos.current = newTodos

    return newTodos
  }

  return (
    <HandleTodosContext.Provider value={{ addTodo, removeTodo, updateTodo }}>
      {children}
    </HandleTodosContext.Provider>
  )
}
