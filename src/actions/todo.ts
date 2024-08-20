'use server'

import { auth } from '@/auth'
import { db } from '@/db'
import { insertTodoSchema, todos } from '@/db/schemas/todos'
import { TTodo, TTodoActionResponse } from '@/types/todos'
import { wait } from '@/util/helpers'
import { desc, eq } from 'drizzle-orm'
import z from 'zod'

/**
 * Server action to fetch all todos for a given user id
 * and return them as an array.
 *
 * If it fails to fetch the data, it will throw an error.
 */
export async function getTodosByUserId(
  id?: string,
): Promise<TTodoActionResponse<TTodo[]>> {
  try {
    // First let's check if there is actually an ID present
    // If not, we throw an error
    if (!id) throw new Error('No user id provided')

    // Then we fetch all todos for the given userId
    const data = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, id))
      .orderBy(desc(todos.createdAt))

    // And return the data
    return { data, success: true }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      data: null,
      error: {
        status: 500,
        errors: [{ message: 'Something went wrong, please try again later' }],
      },
    }
  }
}

/**
 * Server actions to create new todo
 * and return the newly created todo.
 *
 * If it fails to create, it will throw an error.
 */
export async function createTodo(
  todo: z.infer<typeof insertTodoSchema>,
): Promise<TTodoActionResponse<TTodo>> {
  try {
    // First, let's confirm that the user is logged-in
    const session = await auth()

    if (session?.user?.id) {
      // Secondly, let's validate the todo information
      insertTodoSchema.parse(todo)

      // If it passes, we insert the todo into the database
      const data = await db
        .insert(todos)
        .values({
          ...todo,
          userId: session.user.id,
        })
        .returning()

      // And return the data
      return { data: data[0], success: true }
    } else {
      throw new Error('You need to be logged in to create a todo')
    }
  } catch (error) {
    // Validation error
    if (error instanceof z.ZodError) {
      return {
        data: null,
        success: false,
        error: { status: 400, errors: error.errors },
      }
    } else {
      // Other error's
      console.error(error)
      return {
        data: null,
        success: false,
        error: {
          errors: [{ message: 'Something went wrong, please try again later' }],
          status: 500,
        },
      }
    }
  }
}

/**
 * Server actions to delete a todo
 *
 * If it fails to delete, it will throw an error.
 */
export async function deleteTodo(todo: TTodo) {
  try {
    // First let's confirm that current user is logged-in
    // and the owner of the todo
    const session = await auth()
    if (session?.user?.id && session.user.id === todo.userId) {
      // If the user is the owner, we delete the todo
      await db.delete(todos).where(eq(todos.id, todo.id))

      return { success: true }
    } else {
      throw new Error('You are not authorized to delete this todo')
    }
  } catch (error) {
    console.error(error)
    throw new Error('Something went wrong, please try again later')
  }
}

/**
 * Server action to check or uncheck the todo as completed.
 *
 * If it succeeds, it will return an object with the error
 * key set to true. If it fails, it will throw an error.
 */
export async function toggleTodoCompleted(todo: TTodo) {
  try {
    // First let's confirm that current user is logged-in
    // and the owner of the todo
    const session = await auth()
    if (session?.user?.id && session.user.id === todo.userId) {
      // If the user is the owner, let's toggle the todo
      const res = await db
        .update(todos)
        .set({
          completed: !todo.completed,
        })
        .where(eq(todos.id, todo.id))

      return { success: true }
    } else {
      throw new Error('User not authorized to update this todo')
    }
  } catch (error) {
    console.error(error)
    throw new Error('Something went wrong, please try again later')
  }
}
