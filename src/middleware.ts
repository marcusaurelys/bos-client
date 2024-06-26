import { NextResponse } from 'next/server'
export default async function middleware(request : any) {

  const response = await fetch(`http://flask.doomerang.org/api/users/verify`, {
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
          location: `http://flask.doomerang.org/login`  
        }
      })
  } else if (result['success']) {
     return NextResponse.next() 
  }
  
  console.log("MAY MALING NANGYARI IF NANDITO")
}

export const config = {
  matcher: [
    '/',
   // '/admin',
    '/bot',
    '/chat',
    '/ticket',
    '/ticket/:path*',
  ]
}

