import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { db } from './db'
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from './db/schemas/users'

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
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  debug: !!(process.env.NODE_ENV === 'development'),
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    // signIn: async ({ user, account }) => {
    // if (account?.provider === 'resend') {
    // if (!user?.email) return false
    //   const userExists = await db
    //     .select({ email: users.email })
    //     .from(users)
    //     .where(eq(users.email, user.email))
    //   if (userExists.length === 0) {
    //     throw new Error('This emailaddress does not exist')
    //   }
    //   return true
    // } else if (account?.provider === 'google') {
    //   return true
    // }
    // return false
    // },
  },
  pages: {
    signIn: '/auth/signin',
  },
})
