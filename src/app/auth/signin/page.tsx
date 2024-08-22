import { auth } from '@/auth'
import Logo from '@/components/Logo'
import SignInForm from '@/components/SignInForm'
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
    <main className='p-5 flex justify-center items-center w-full h-full'>
      <div className='flex flex-col gap-3 max-w-[500px] min-w-[350px] sm:max-w-[500px] w-full'>
        <Logo />
        <Card className=''>
          <CardHeader>
            <h1 className='text-slate-800 font-normal text-3xl text-left'>
              Let&apos;s <span className='underline font-semibold'>todo</span>{' '}
              something today!
            </h1>
          </CardHeader>
          <CardContent>
            <SignInForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
