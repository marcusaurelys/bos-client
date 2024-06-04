export interface User {
    email : string,
    role : string,
    name : string
}


export interface UserSession {
    name : string,
    role : string,
}

interface Ticket {
    id: string,
    title: string,
    description: string,
    status: string,
    priority: string,
    tags: string[]
    dateCreated: string
}
