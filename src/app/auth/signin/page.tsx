import { auth } from '@/auth'
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
    <main className='flex justify-center items-center w-full h-full'>
      <Card className='min-w-[500px]'>
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
    </main>
  )
}
