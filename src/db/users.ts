import client from "@/db/mongo"
import { UUID } from "crypto"

export const users = client.db('business-os').collection('users')


export const getUser = async(email : string) => {
    const result = await users.findOne({email : email})
    console.log(result)
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

interface UserSession {
    name : string,
    role : string,
}

export const getToken = async(token : string) => {
    const find = await users.findOne({token: token})
    if(find != null){
        const result : UserSession = {name : find.name, role : find.role}
        return result
    }

    return null

}