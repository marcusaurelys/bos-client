'use server'

import { useDB } from "@/db/mongo"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
import { ObjectId } from 'mongodb'
import { revalidatePath } from "next/cache";
import { sendMessage } from "@/app/api/listen/server";

const Users = async () => {
    const db = await useDB()
    const users = db.collection('users')

    return users
}

const Tickets = async () => {
    const db = await useDB()
    const tickets = db.collection('tickets')

    return tickets
}

/**
 * Empty function to as a workaround for https://github.com/vercel/next.js/issues/54282
 * 
 * @returns {Promise<void>}
 */
export const fuckNextUsers = async() => {
    
}

/**
 * Fetches a user by their email.
 * 
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Object | null>} The user object or null if an error occurs.
 */
export const getUser = async(email : string) => {
    const users = await Users()
    try{
        const result = await users.findOne({email : email});

        if (result && result._id) {
            result._id = result._id.toString();
        }

        return result;
    }
    catch (error){
        console.error("getUser error: ",error);
        redirect('/')
    }
}


/**
 * Fetches a user by their authentication token.
 * 
 * @param {string} token - The authentication token of the user.
 * @returns {Promise<Object | null>} The user object or null if an error occurs.
 */
export const getUserByToken = async(token : string) => {
    const users = await Users()
    try {
        const result = await users.findOne({token: token})

        if (result && result._id) {
            result._id = result._id.toString();
        }

        return result
    } catch (error){
        console.error("getUserByToken error: ",error)
        redirect('/')
    }
}

/**
 * Fetches all users from the database.
 * 
 * @returns {Promise<string>} A JSON string of all users.
 */
export const getAllUsers = async() => {
    const users = await Users()
    try{
        const result = await users.find({}).toArray()

        for (const user of result){
            user._id = user._id.toString()
        }

        return result
    } catch (error){
        console.error("getAllUsers error: ",error)
        redirect('/')
    }
}

/**
 * Registers a new user.
 * 
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {string} confirm - The password confirmation.
 * @param {string} role - The role of the user.
 * @param {string} discord - The Discord username of the user.
 * @returns {Promise<boolean>} True if registration was successful, false otherwise.
 */
export const register = async (name: string, email: string, password: string, confirm: string, role: string, discord: string) => {
    const users = await Users()
    let success = false

    let valid = await validateUser()
    if(valid == null){
        redirect('/login')
    }

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
        sendMessage()
        /*
        if (!result) {
            redirect('?failregister')
        }
            */
    }
    catch (error){
        
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

/**
 * Logs in a user.
 * 
 * @param {FormData} formData - The form data containing the user's email and password.
 * @returns {Promise<void>}
 */    
export const login = async(formData : FormData) => {
    const users = await Users()
    
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
    
    cookies().set('session', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: false, // set to when we begin using process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 21,
    })

    const usertoken = {
        name: user.name,
        email: user.email,
        role: user.role
    }
    
    cookies().set('user', JSON.stringify(usertoken), {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: false, // set to when we begin using process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 21,
    })

    redirect('/')

}

/**
 * Logs out a user by deleting their session cookie.
 * 
 * @returns {Promise<void>}
 */
export const logout = async() => {
    
    try{
        cookies().delete("session")
    } catch (error) {
        console.error("logout error: ", error)
    }
    redirect('/login')
}

/**
 * Validates the current user's session.
 * 
 * @returns {Promise<string | null>} A JSON string of the user object or null if an error occurs.
 */
export const validateUser = async() => {
    try{
        const token = cookies().get('session')?.value || ''
        const user = await getUserByToken(token)
        return user
    } catch (error){
        console.error("validateUser error: ", error)
        redirect(`/oops?error=${error}`)
    }
}

/**
 * Edits a user's details.
 * 
 * @param {string} id - The ID of the user to edit.
 * @param {string} name - The new name of the user.
 * @param {string} email - The new email of the user.
 * @param {string} role - The new role of the user.
 * @param {string} discord - The new Discord username of the user.
 * @returns {Promise<Object | null>} The updated user object or null if an error occurs.
 */
export const editUser = async (id : string, name : string, email : string, role : string, discord : string) => {
    const users = await Users()
    try{

        let valid = await validateUser()
        if(valid == null){
            throw new Error('Invalid token!')
        }

        const user = await users.updateOne({_id : new ObjectId(id)}, {$set: {name : name, email : email, role: role, discord : discord}})
        revalidatePath('/admin')
        sendMessage()
        return user
    } catch (error){
        console.error("editUser error: ",error)
        redirect(`/oops?error=${error}`)
    }
}

/**
 * Changes a user's password.
 * 
 * @param {string} id - The ID of the user.
 * @param {string} password - The new password.
 * @param {string} confirm - The password confirmation.
 * @returns {Promise<Object | string>} The updated user object or an error message if passwords do not match.
 */
export const changePasswordForUser = async(id : string, password: string, confirm: string) => {
    const users = await Users()
    if(password !== confirm){
        return "Passwords do not match!"
    }


    try {
    
        let valid = await validateUser()
        if(valid == null){
            throw new Error('Invalid token!')
        }

        const hash = await bcrypt.hash(password, 10)
        const user = await users.updateOne({_id : new ObjectId(id)}, {$set : {password: hash}})
        return user
    } catch (error) {
        console.error("changePasswordForUser error: ", error)
        redirect(`/oops?error=${error}`)
    }
}

/**
 * Deletes a user and updates related tickets.
 * 
 * @param {string} _id - The ID of the user to delete.
 * @returns {Promise<Object | null>} The result of the delete operation or null if an error occurs.
 */
export const deleteUser = async(_id : string) => {
    const users = await Users()
    const tickets = await Tickets()
    try {

        let valid = await validateUser()
        if(valid == null){
            throw new Error('Invalid token!')
        }

        const res = await users.deleteOne({_id : new ObjectId(_id)})

        tickets.updateMany(
            {userIDs : _id},
            {$pull : {'userIDs' : _id}}
        )

        sendMessage()
        revalidatePath('/admin')
        return res
    } catch( error ){
        console.error("delete user errror:", error)
        redirect(`/oops?error=${error}`)
    }
    
}
