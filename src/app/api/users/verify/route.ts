import { cookies } from 'next/headers'
import { getUserByToken } from '@/db/users'


// This is a workaroud for Next.js not supporting Node.js runtimes in the middleware. We therefore create a route handler for validating requests that the middleware can then call.
// See https://github.com/vercel/next.js/discussions/46722

export async function GET() {
  const token = cookies().get('session')
  if (!token) {
    return new Response(JSON.stringify({error: 'No token found!'}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  
  const user = await getUserByToken(token.value)

  if (!user) {
    return new Response(JSON.stringify({error: 'No user with that token found!'}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
    

  return new Response(JSON.stringify({success: 'Valid token!'}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  
} 
