import client from "@/db/mongo"

export const users = client.db('business-os').collection('users')


export const getUser = async(email : string) => {
    const result = await users.findOne({email : email})
    console.log(result)
    return result
}