import { UserEntity } from '@/database/entities';
import { FindManyOptions } from 'typeorm';

export class CreateUserDTO {
    public name!: string;
    public email!: string;
    public password!: string;
}

export class FindUsersDTO implements FindManyOptions<UserEntity> {}

export class UserExistsDTO {
    public id?: string;
    public email?: string;
}

export class UpdateUserDTO {
    public id!: string;
    public data!: {
        name?: string;
        email?: string;
    };
}
