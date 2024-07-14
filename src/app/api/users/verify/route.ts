import { cookies } from 'next/headers'
import { getUserByToken } from '@/db/users'

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
