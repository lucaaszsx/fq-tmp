/**
 * @file UserRepository.ts
 * @description Database user entity repository for handling data.
 * @author Lucas
 * @license MIT
 */

import { appDataSource } from "@/database/AppDataSource";
import { UserEntity } from "@/database/entities";

export const userRepository = appDataSource.getRepository(UserEntity);