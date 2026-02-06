/**
 * @file RoleRepository.ts
 * @description Database role entity repository for handling data.
 * @author Lucas
 * @license MIT
 */

import { appDataSource } from "@/database/AppDataSource";
import { RoleEntity } from "@/database/entities";

export const roleRepository = appDataSource.getRepository(RoleEntity);