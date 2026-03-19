import { UserEntity } from '@/database/entities';

export interface CreateUserOptions {
    fullName: string;
    email: string;
    password: string;
}

export interface FindUsersOptions {
    page?: number;
    limit?: number;
}

export interface FindOneOptions {}

export interface UserExistsOptions {
    id?: string;
    email?: string;
}

export interface UpdateUserOptions {
    id: string;
    data: {
        fullName: string;
        email: string;
    };
}
