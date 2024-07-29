export interface User {
    _id: string,
    email : string,
    role : string,
    name : string,
    discord : string
}


export interface UserSession {
    name : string,
    email : string,
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

export interface ITicketDocument {
    _id: string,
    name: string,
    description: string,
    status: string,
    priority_score: string,
    userIDs: string[],
    tags: string[],
    date_created: string
}

export interface IClient {
    id: string,
    writer: WritableStreamDefaultWriter
}

export interface IChatbotResponse {
    response: string
}
