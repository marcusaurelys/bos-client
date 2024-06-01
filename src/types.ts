interface User {
    email : string,
    role : string,
    name : string
}

interface Ticket {
    id: number,
    title: string,
    description: string,
    status: string,
    priority: string,
    tags: string[]
    dateCreated: string
}