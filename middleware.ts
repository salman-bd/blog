// middleware.ts example
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // console.log('\nPath and request url: ', path, req.url);
  
  
  // Check if path starts with /admin
  if (path.startsWith('/admin') && path !== '/admin-signin') {
    // Get session from cookie (optimistic check)
    const session = req.cookies.get('next-auth.session-token')
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin-signin?callbackUrl=' + encodeURIComponent(path), req.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}