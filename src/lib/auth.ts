import { getToken, hasToken, setToken } from "@/db/users"
import { UserSession } from "@/types"
import { UUID } from "mongodb"
import { cookies } from 'next/headers'
import { redirect } from "next/navigation"


interface UserCookie {
    _id : UUID,
    email : string,
    password : string,
    role : 'admin' | 'user',
    name : string,
    tokenExpiry : Date 
    token : string


}

interface User {
    _id : UUID,
    email : string,
    password : string,
    role : 'admin' | 'user',
    name : string,
    
}


export async function login(user : string){
    
    const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 21)
    let token = await hasToken(user)

    //create cookie
    if(token == null){
        console.log(token)
        console.log('no existing token, creating new one')
        token = crypto.randomUUID()
    }
    
    //send cookie to server
    setToken(user, token, expiry)

    //set cookie to browser
    cookies().set('session', token, {expires : expiry})


    //return 
    

}


//returns null if user is not allowed on route, otherwise returns userSession
export async function validateUser(roles : string[]){
    const cookie = cookies().get('session')?.value || ''
   
    const user = await getToken(cookie)

    if(user != null){
        let allowed = false
        roles.forEach(role => {
            if(role == user.role){
                allowed = true
            }
        })
        if(allowed){
            return user
        }
    }

    return null
}


