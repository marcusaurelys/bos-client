import { getToken, setToken } from "@/db/users"
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
    //create cookie

    const token = crypto.randomUUID()
    const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 21)

    //send cookie to server
    setToken(user, token, expiry)

    //set cookie to browser
    cookies().set('session', token, {expires : expiry})


    //return 
    

}

