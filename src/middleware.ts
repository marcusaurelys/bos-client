import { NextResponse } from 'next/server'

/**
 * Middleware function to verify user session.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} A NextResponse object indicating whether the user is redirected or allowed to proceed.
 */
export default async function middleware(request : any) {

  const HOST = process.env.HOST

  const response = await fetch(`http://${HOST}/api/users/verify`, {
    method: 'GET',
    headers: {
      cookie: request.cookies
    }
  })

  const result = await response.json()
  
  if (result['error']) {
      return new NextResponse(null, {
        status: 307,
        headers: {
          'Set-Cookie': 'session=; Max-Age=-1; Path=/',
          location: `http://${HOST}/login`  
        }
      })
  } else if (result['success']) {
     return NextResponse.next() 
  }
  
  
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)', 
  ]
}

