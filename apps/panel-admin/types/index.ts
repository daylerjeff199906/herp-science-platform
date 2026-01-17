
import { IPerson } from './person'

export interface IUser {
    id: string
    person: IPerson
    username: string
    role: string
    status: string
    createdAt: string
    updatedAt: string
}

export interface IUsername {
    username: string
}

export interface IPassword {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

export interface IUserRole {
    role: string
}

export interface ICredentials {
    token: string
    user: IUser
}

export interface IResposeLogin {
    status: number
    data?: ICredentials
    errors?: string[]
}

export interface IAuth {
    username?: string
    password?: string
}
