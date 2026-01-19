
import { IPerson } from './person'
import { Country, CountryFilter } from '@repo/shared-types'

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

// Country Re-exports and Definitions
export type ICountry = Country
export type ICountryFilter = CountryFilter
export type ICountryPost = Omit<Country, 'id' | 'createdAt' | 'updatedAt'>

// API Interfaces
export interface IResApiList<T> {
    data: T[]
    totalItems: number
    totalPages: number
    currentPage: number
}

export interface IResApiMessage {
    status: number
    message: string
    error?: string | string[] | null
}
