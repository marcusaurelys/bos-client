import { cookies } from 'next/headers'

export default async function handler(req, res) {
  const token = cookies().get('session')

  if (!token.value) {
    res.status(404).json({error: 'No token found!''})
  }
  
  const response = await get_user_by_token(token.value)

  if (!user) {
    res.status(404).json({error: 'No user with that token!'})
  }
    
  res.status(200).json({success: 'Valid token!'})
  
} 
