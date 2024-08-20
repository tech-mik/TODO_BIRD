import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { v4 as uuidv4 } from 'uuid'
import { users } from './users'

export const todos = sqliteTable('todos', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  text: text('todo').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('createdAt')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
})

export const insertTodoSchema = createInsertSchema(todos, {
  text: (schema) => schema.text.min(1).max(255),
  userId: (schema) => schema.userId.nullish(),
})

export const selectTodoSchema = createSelectSchema(todos)
