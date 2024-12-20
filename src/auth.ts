import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth, { User } from 'next-auth'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import Credentials from 'next-auth/providers/credentials'
import { db } from './db'
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from './db/schemas/users'
import { getUserByEmail, getUserById } from './actions/user'

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: 'noreply@backstr.app',
    }),
    Credentials({
      authorize: async (credentials) => {
        if (credentials.email === 'example@mail.com') {
          const data = await getUserByEmail('example@mail.com')

          if (data) {
            return { ...data } as User
          }
        }
        return null
      },
    }),
  ],
  adapter: DrizzleAdapter(db),
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    session: async ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin',
  },
})
