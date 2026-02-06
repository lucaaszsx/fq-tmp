/**
 * @file SessionRepository.ts
 * @description Database user entity repository for handling data.
 * @author Lucas
 * @license MIT
 */

import { appDataSource } from "@/database/AppDataSource";
import { SessionEntity } from "@/database/entities";

export const sessionRepository = appDataSource.getRepository(SessionEntity);