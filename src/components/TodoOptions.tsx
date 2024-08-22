import { deleteTodo } from '@/actions/todo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  HandleTodosContext,
  IHandleTodosContext,
} from '@/context/HandleTodosContext'
import { TTodo } from '@/types/todos'
import { DotsThreeVertical } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useContext } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'

interface ITodoOptionsProps {
  todo: TTodo
  showForm: boolean
  setShowForm: Dispatch<SetStateAction<boolean>>
}

export default function TodoOptions({
  todo,
  showForm,
  setShowForm,
}: ITodoOptionsProps) {
  const queryClient = useQueryClient()
  const { addTodo, removeTodo, updateTodo } = useContext(
    HandleTodosContext,
  ) as IHandleTodosContext
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

      return { todo, previousTodos }
    },

    onSettled: (data, _1, _2, context) => {
      if (data?.success && data.data) {
        toast.success('Todo deleted successfully')
      } else if (data?.error) {
        console.log(data.error)
        addTodo({ todo: context?.todo!, previousTodos: context?.previousTodos })
      }
      // queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <DropdownMenu>
      <Button variant='outline' className='px-2' disabled={showForm} asChild>
        <DropdownMenuTrigger>
          <DotsThreeVertical size={18} />
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent>
        <DropdownMenuItem className='cursor-pointer' asChild>
          <span onClick={() => setShowForm((prev) => !prev)}>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' asChild>
          <span onClick={() => deleteTodoMutation(todo)}>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
