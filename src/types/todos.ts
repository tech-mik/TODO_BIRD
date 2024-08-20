import { insertTodoSchema, todos } from '@/db/schemas/todos'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'

export type TTodo = InferSelectModel<typeof todos>
export type TNewTodo = z.infer<typeof insertTodoSchema>

export type TTodoActionResponse<T> = {
  success: boolean
  data: T | null
  error?: {
    errors: any[]
    status: number
  }
}
