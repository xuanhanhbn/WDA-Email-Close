import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    debugger
    console.log('req.nextauth: ', req.nextauth)
    if (req.nextUrl.pathname === '/admin-dashboard' && req.nextauth.token?.role !== 'admin') {
      return new NextResponse('You are not authorized!')
    }
  },
  {
    callbacks: {
      authorized: params => {
        let { token } = params

        return !!token
      }
    }
  }
)

export const config = { matcher: ['/admin-dashboard'] }
