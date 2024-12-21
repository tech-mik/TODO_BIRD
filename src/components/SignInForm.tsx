'use client'

import { signInWithEmail } from '@/actions/auth'
import { loginUserSchema } from '@/db/schemas/users'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaGoogle } from 'react-icons/fa'
import { toast } from 'sonner'
import z from 'zod'
import SpinnerSmall from './SpinnerSmall'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Input } from './ui/input'

export default function SignInForm() {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const testingParam = searchParams.get('testing')

  const form = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof loginUserSchema>) => {
    setIsPending(true)

    // Call server action
    const res = await signInWithEmail(values)
    console.log(res)

    if (res.success) {
      if (res.success === 'testAccount') {
        router.replace('/')
      } else {
        toast.success('Check your mail for your magic link')
        form.reset()
      }
    }
    if (res.error) {
      toast.error(res.error.message)
    }
    setIsPending(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-6'>
        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  value={
                    testingParam === 'true'
                      ? 'example@mail.com'
                      : field.value ?? ''
                  }
                  placeholder='example@mail.com'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex sm:flex-row flex-col justify-between gap-5'>
          <Button disabled={isPending} className='w-full' type='submit'>
            {isPending && <SpinnerSmall />}
            Sign in with Email
          </Button>
          <Button
            variant={'outline'}
            className='w-full'
            type='button'
            onMouseDown={() => signIn('google')}>
            <FaGoogle className='mr-2 w-4 h-4' />
            Sign in with Google
          </Button>
        </div>
      </form>
    </Form>
  )
}
