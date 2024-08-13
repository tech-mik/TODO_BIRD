'use server'

import { signIn } from '@/auth'
import { loginUserSchema } from '@/db/schemas/users'
import console from 'console'
import { AuthError } from 'next-auth'
import z from 'zod'

export async function signInWithEmail(
  formData: z.infer<typeof loginUserSchema>,
): Promise<{
  success: boolean | string
  error: false | { type: string; message: string }
}> {
  try {
    // Validate schema
    await loginUserSchema.parseAsync(formData)

    // Call SignIn from NextAuth
    const redirectURL = await signIn('resend', {
      email: formData.email,
      redirect: false,
    })

    return {
      success: redirectURL,
      error: false,
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error(err)

      return {
        error: {
          type: 'validation',
          message: err.errors[0].message,
        },
        success: false,
      }
    } else if (err instanceof AuthError) {
      console.error(err)

      return {
        error: {
          type: 'auth',
          message: err.cause?.err?.message || 'Something went wrong',
        },
        success: false,
      }
    } else {
      console.error(err)

      return {
        error: {
          type: 'unknown',
          message: 'Something went wrong, please try again',
        },
        success: false,
      }
    }
  }
}
