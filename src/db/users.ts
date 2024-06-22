'use server'

import { useDB } from "@/db/mongo"
import bcrypt from "bcryptjs"
import { UserSession } from '@/types'
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
import { UUID } from 'mongodb'

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
    const result = await users.findOne({email : email})
    return result
}

export const get_user_by_token = async(token) => {
    const result = await users.findOne({token: token})
    return result
}

export const getAllUsers = async() => {

    const result = await users.find({}).toArray()
    return JSON.stringify(result)
    
}

export const register = async (formData : FormData) => {
    let success = false

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirm = formData.get('confirm-pass') as string
    const role = formData.get('role') as string
    const discord = formData.get('discord') as string
 
    const emailTaken = await users.findOne({email : email})

    if (emailTaken) {
        redirect('?failregister')
    }

    const passHash = await bcrypt.hash(password, 10)    
    const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 21)
    const token = crypto.randomUUID()
    const result = await users.insertOne({
        name : name, 
        email : email, 
        password : passHash, 
        role : role,
        discord : discord,
        token: token,
        tokenExpiry: expiry
    })

    if (!result) {
        redirect('?failregister')
    }

    cookies().set('session', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 21,
    })
    
    redirect('/')
    
}

    
export const login = async(formData) => {
    
    let success = false
    const token = crypto.randomUUID()
    const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 21)
    const user = await users.findOne({email: formData.get('email')})

    if (!user) {
        redirect('fail')
    }
    
    success = await bcrypt.compare(formData.get('password'), user.password)
    
    if (!success) {
        redirect('fail')
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
    cookies().delete("session")
    redirect('/login')
}


export const validateUser = async() => {
    
    const token = cookies().get('session')?.value || ''
    const user = await get_user_by_token(token)

    return null
}

