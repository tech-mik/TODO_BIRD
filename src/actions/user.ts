'use server'

import { db } from '@/db'
import { users } from '@/db/schemas/users'
import { eq } from 'drizzle-orm'

export async function getUserById(id: string) {
  try {
    const data = await db.select().from(users).where(eq(users.id, id)).get()

    return { data }
  } catch (error) {
    return { error: JSON.stringify(error) }
  }
}
