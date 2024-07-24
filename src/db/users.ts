'use server'

import { useDB } from "@/db/mongo"
import bcrypt from "bcryptjs"
import { UserSession } from '@/types'
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
import { ObjectId, UUID } from 'mongodb'
import { revalidatePath } from "next/cache";

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

const db = await useDB()
const users = db.collection('users')

export const fuckNextUsers = async() => {
    
}

export const getUser = async(email : string) => {
    try{
        const result = await users.findOne({email : email});
        return result;
    }
    catch (error){
        console.error("getUser error: ",error);
        redirect('/')
    }
}

export const getUserByToken = async(token : string) => {
    try {
        const result = await users.findOne({token: token})
        return result
    } catch (error){
        console.error("getUserByToken error: ",error)
        redirect('/')
    }
}

export const getAllUsers = async() => {
    try{
        const result = await users.find({}).toArray()
        return JSON.stringify(result)
    } catch (error){
        console.error("getAllUsers error: ",error)
        redirect('/')
    }
}

export const register = async (name: string, email: string, password: string, confirm: string, role: string, discord: string) => {
    let success = false

    const emailTaken = await users.findOne({email : email})

    if (emailTaken){
        redirect('?failregister')
    }

    const passHash = await bcrypt.hash(password, 10)    
    const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 21)
    const token = crypto.randomUUID()

    try {
        const result = await users.insertOne({
            name : name, 
            email : email, 
            password : passHash, 
            role : role,
            discord : discord,
            token: token,
            tokenExpiry: expiry
        })
        success = true
        revalidatePath('/admin')
        /*
        if (!result) {
            redirect('?failregister')
        }
            */
    }
    catch (error){
        console.log("error in register users")
        success = false
        redirect('?failregister')
    }
    finally{
        return success
    }
 
    /*
    cookies().set('session', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 21,
    })
    
    redirect('/')
    */
}
    
export const login = async(formData : FormData) => {
    
    let success : Promise<boolean> | boolean = false
    const token = crypto.randomUUID()
    const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 21)
    const user = await users.findOne({email: formData.get('email')})

    if (!user) {
        redirect('?wrongUsername')
    }
    
    success = await bcrypt.compare((formData.get('password') as string), user.password)
    
    if (!success) {
        redirect('?wrongPassword')
    } 

    const response = await users.updateOne({email: user.email}, {$set: {token: token, tokenExpiry: expiry}})

    if (!response) {
        redirect('fail')
    }
    console.log("setting cookie")
    cookies().set('session', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 21,
    })

    redirect('/')

}
    
export const logout = async() => {
    try{
        cookies().delete("session")
        redirect('/login')
    } catch (error) {
        console.error("logout error: ", error)
        redirect('/')
    }
}

export const validateUser = async() => {
    try{
        const token = cookies().get('session')?.value || ''
        const user = await getUserByToken(token)
    
        return JSON.stringify(user)
    } catch (error){
        console.error("validateUser error: ", error)
        redirect('/')
    }
}

export const editUser = async (id : string, name : string, email : string, role : string, discord : string) => {
    try{
        const user = await users.updateOne({_id : new ObjectId(id)}, {$set: {name : name, email : email, role: role, discord : discord}})
        revalidatePath('/admin')
        return user
    } catch (error){
        console.error("editUser error: ",error)
        redirect('/')
    }
}

export const changePasswordForUser = async(id : string, password: string, confirm: string) => {
    if(password !== confirm){
        return "Passwords do not match!"
    }

    try {
        const hash = await bcrypt.hash(password, 10)
        const user = await users.updateOne({_id : new ObjectId(id)}, {$set : {password: hash}})
        return user
    } catch (error) {
        console.error("changePasswordForUser error: ", error)
        redirect('/')
    }
}

export const deleteUser = async(_id : string) => {
    try {
        const res = users.deleteOne({_id : new ObjectId(_id)})
        revalidatePath('/admin')
        return res
    } catch( error ){
        console.error("delete user errror:", error)
        redirect('/')
    }
}