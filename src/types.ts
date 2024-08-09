import { ObjectId } from "mongodb"

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

export interface ITicket{
    _id: string,
    name: string,
    description: string,
    status: string,
    priority_score: string,
    userIDs: string[],
    tags: string[],
    date_created: string,
    chat_id: string,
}

export interface IClient {
    id: string,
    writer: WritableStreamDefaultWriter
}

export interface IChatbotResponse {
    response: string
}

export interface IChat
  {
    id: string // irrelevant in this case
    chat_id: string // 'session_id' of conversation in Crisp
    messages: IMessage[]
  }


  export interface IMessage {
    content: string,
    from: string,
  }

  export interface IMessageDict {
    [session_id: string]: IConversation
  }

  export interface IConversation {
    messages: IMessage[]
  }

  export interface IDevChat {
    _id: string,
    chat_id: string,
    problem_statement: string,
    solution_statement: string,
    messages: IMessage[],
  }
