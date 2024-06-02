import client from "@/db/mongo"
import { UUID } from "crypto"
import bcrypt from "bcryptjs"
import { UserSession } from '@/types'

export const users = client.db('business-os').collection('users')


export const getUser = async(email : string) => {
    const result = await users.findOne({email : email})
    return result
}

interface TokenData {
    name : string,
    token : UUID,
    tokenExpiry : Date 
}

export const setToken = async(name: string, token : string, expires: Date) => {
    const result = await users.updateOne({name : name}, {$set: {token: token, tokenExpiry: expires}})
    if(result){
        return result
    }

    return null

}



//get user info from token
export const getToken = async(token : string | null) => {

    if(token == null){
        return null
    }

    const find = await users.findOne({token: token})
    
    if(find != null){
        const result : UserSession = {name : find.name, role : find.role}
        return result
    }

    return null

}


//return token if exists
export const hasToken = async(user : string) => {
    const find = await users.findOne({name : user})

    if(find != null){

        if(find.token){
            return find.token
        }
        return null
    }

    return null
}

export const createUser = async(name : string, email: string, password: string, role : string) => {

    const result = await users.insertOne({name : name, email : email, password : password, role : role})
    return result
}

export const  getAllUsers = async() => {
    const result = await users.find({})
    return result
    
}
