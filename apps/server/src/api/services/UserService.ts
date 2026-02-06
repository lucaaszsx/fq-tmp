import { userRepository } from "@/database/repositories";
import { UserEntity } from "@/database/entities";
import { CreateUserDTO, ExistsDTO } from "./dtos/UserDTOs";
import { LoggerDecorator } from "@/decorators";
import { LoggerInterface } from "@/lib/logger";
import { FindManyOptions } from "typeorm";
import { Service } from "typedi";

//@Service()
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

    public async find(options: FindManyOptions): Promise<UserEntity[]> {
        const users = await userRepository.find(options);

        return users;
    }

    public async findById(id: string): Promise<UserEntity | null> {
        const user = await userRepository.findOne({ where: { id } });

        return user;
    }

    public async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await userRepository.findOne({ where: { email } });

        return user;
    }

    public async exists(options: ExistsDTO): Promise<boolean> {
        let user;

        if (options.id) user = await this.findById(options.id);
        else if (options.email) user = await this.findByEmail(options.email);

        return user?.isActive as boolean;
    }

    public async updateUser() {}

    public async deactivateUser() {}

    public async activateUser() {}

    public async deleteUser() {}
}