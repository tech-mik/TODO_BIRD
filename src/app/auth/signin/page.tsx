import { auth } from '@/auth'
import Logo from '@/components/Logo'
import SignInForm from '@/components/SignInForm'
import TestToaster from '@/components/TestToaster'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { redirect } from 'next/navigation'

interface ISignInPageProps {
  searchParams: { callbackUrl?: string }
}

export default async function Page({ searchParams }: ISignInPageProps) {
  const session = await auth()
  const { callbackUrl } = searchParams

  if (session) {
    if (callbackUrl) {
      redirect(callbackUrl)
    } else {
      redirect('/')
    }
  }

  return (
    <>
      <TestToaster />
      <main className='flex justify-center items-center p-5 w-full h-full'>
        <div className='flex flex-col gap-3 w-full min-w-[350px] max-w-[500px] sm:max-w-[500px]'>
          <Logo />
          <Card className=''>
            <CardHeader>
              <h1 className='font-normal text-3xl text-left text-slate-800'>
                Let&apos;s <span className='font-semibold underline'>todo</span>{' '}
                something today!
              </h1>
            </CardHeader>
            <CardContent>
              <SignInForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
