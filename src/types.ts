export interface User {
    _id: string,
    email : string,
    role : string,
    name : string
}


export interface UserSession {
    name : string,
    role : string,
}

export interface ITicket {
    id: string,
    title: string,
    description: string,
    status: string,
    priority: string,
    tags: string[],
    userIDs: string[],
    dateCreated: string
}
