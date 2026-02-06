import { CreateUserDTO, UserExistsDTO, FindUsersDTO, UpdateUserDTO } from "./dtos/calls";
import { userRepository } from "@/database/repositories";
import { UserEntity } from "@/database/entities";
import { LoggerDecorator } from "@/decorators";
import { LoggerInterface } from "@/lib/logger";
import { Service } from "typedi";

@Service()
export class UserService {
    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface        
    ) {}

    public async createUser(data: CreateUserDTO): Promise<UserEntity> {
        if (await this.exists({ email: data.email })) throw 1; // throw EmailAlreadyExists error

        const userModel = userRepository.create(data);
        const user = await userRepository.save(userModel);

        return user;
    }

    public async find(options: FindUsersDTO): Promise<UserEntity[]> {
        const users = await userRepository.find(options);

        return users;
    }

    public async findById(id: string, customParams: Partial<UserEntity> = {}): Promise<UserEntity | null> {
        const user = await userRepository.findOne({ where: { id, ...customParams } });

        return user;
    }

    public async findByEmail(email: string, customParams: Partial<UserEntity> = {}): Promise<UserEntity | null> {
        const user = await userRepository.findOne({ where: { email, ...customParams } });

        return user;
    }

    public async exists(options: UserExistsDTO): Promise<boolean> {
        let user;

        if (options.id) user = await this.findById(options.id);
        else if (options.email) user = await this.findByEmail(options.email);

        return user?.isActive as boolean;
    }

    public async updateUser(options: UpdateUserDTO) {
        const { data, id } = options;
        const user = await this.findById(id, { isActive: true });

        if (!user) throw 0;
        if (
            data.email &&
            await this.exists({ email: data.email})
        ) throw 0;

        userRepository.merge(user, data);

        return userRepository.save(user);
    }

    public async deactivateUser(id: string) {

    }

    public async activateUser() {}

    public async deleteUser() {}
}