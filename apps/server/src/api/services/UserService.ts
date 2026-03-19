import {
    CreateUserOptions,
    UpdateUserOptions,
    UserExistsOptions,
    FindUsersOptions,
    FindOneOptions
} from './dtos/calls';
import { EmailAlreadyExistsException, UserNotFoundException } from '../responses';
import { userRepository } from '@/database/repositories';
import { UserEntity } from '@/database/entities';
import { LoggerDecorator } from '@/decorators';
import { LoggerInterface } from '@/lib/logger';
import { Service } from 'typedi';
import { FindOptionsWhere } from 'typeorm';

@Service()
export class UserService {
    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface
    ) {}

    public async create(data: CreateUserOptions): Promise<UserEntity> {
        const emailExists = await this.exists({ email: data.email });

        if (emailExists) throw new EmailAlreadyExistsException();

        const userModel = userRepository.create(data);
        const user = await userRepository.save(userModel);

        return user;
    }

    public async find(options: FindUsersOptions): Promise<UserEntity[]> {
        const page = options.page || 1;
        const limit = options.limit || 10;

        return userRepository.find({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' }
        });
    }

    public findOne(options: FindOneOptions): Promise<UserEntity | null> {
        return userRepository.findOne(options);
    }

    public async findById(id: string): Promise<UserEntity | null> {
        const user = await this.findOne({ where: { id } });

        if (!user?.isActive) throw new UserNotFoundException();

        return user;
    }

    public async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.findOne({ where: { email } });

        if (!user?.isActive) throw new UserNotFoundException();

        return user;
    }

    public async exists(options: UserExistsOptions): Promise<boolean> {
        const { email, id } = options;

        if (!email && !id) return false;

        return userRepository.exists({
            where: [...(id ? [{ id }] : []), ...(email ? [{ email }] : [])]
        });
    }
}
