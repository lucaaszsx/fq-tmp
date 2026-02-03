/**
 * @file AppVersionService.ts
 * @description Application version management
 * @author Lucas
 * @license Apache-2.0
 */

import {
    VersionAlreadyExistsException,
    NoActiveVersionsException,
    VersionNotFoundException
} from '../responses';
import { AppVersionRepository } from '../../database/repositories/AppVersionRepository';
import { AppVersion } from '../models/AppVersionEntity';
import { LoggerDecorator } from '@/decorators';
import { LoggerInterface } from '@/lib/logger';
import { Service } from 'typedi';

@Service()
export class AppVersionService {
    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface,
        private readonly versionRepository: AppVersionRepository
    ) {}

    public async create(data: Partial<AppVersion>): Promise<AppVersion> {
        const identifier = `${data.version || 'unknown'}`;

        this.logger.info(`Creating new version => ${identifier}`);

        try {
            const exists = await this.versionRepository.findByVersion(data.version!);

            if (exists) {
                this.logger.warn(`Version ${identifier} already exists`);

                throw new VersionAlreadyExistsException(identifier);
            }

            const version = await this.versionRepository.create(data);

            this.logger.info(`Version created successfully => ${identifier} (ID: ${version.id})`);

            return version;
        } catch (error: unknown) {
            if (error instanceof VersionAlreadyExistsException) throw error;

            this.logger.error(`Error creating version => ${identifier}: ${(error as Error).message}`);

            throw error;
        }
    }

    public async findById(id: string): Promise<AppVersion> {
        this.logger.info(`Finding version by ID => ${id}`);

        try {
            const version = await this.versionRepository.findById(id);

            if (!version) {
                this.logger.warn(`Version with ID ${id} not found`);

                throw new VersionNotFoundException(id);
            }

            return version;
        } catch (error: unknown) {
            if (error instanceof VersionNotFoundException) throw error;

            this.logger.error(`Error finding version by ID => ${id}: ${(error as Error).message}`);

            throw error;
        }
    }

    public async findByVersion(version: string): Promise<AppVersion> {
        this.logger.info(`Finding version by string => ${version}`);

        try {
            const versionData = await this.versionRepository.findByVersion(version);

            if (!versionData) {
                this.logger.warn(`Version ${version} not found`);

                throw new VersionNotFoundException(version);
            }

            return versionData;
        } catch (error: unknown) {
            if (error instanceof VersionNotFoundException) throw error;

            this.logger.error(`Error finding version by string => ${version}: ${(error as Error).message}`);

            throw error;
        }
    }

    public async findAll(): Promise<AppVersion[]> {
        this.logger.info(`Finding all active versions`);

        try {
            return await this.versionRepository.findAll();
        } catch (error: unknown) {
            this.logger.error(`Error finding all versions: ${(error as Error).message}`);

            throw error;
        }
    }

    public async findLatest(): Promise<AppVersion> {
        this.logger.info(`Finding latest version`);

        try {
            const version = await this.versionRepository.findLatest();

            if (!version) {
                this.logger.warn(`No active versions found`);

                throw new NoActiveVersionsException();
            }

            return version;
        } catch (error: unknown) {
            if (error instanceof NoActiveVersionsException) throw error;

            this.logger.error(`Error finding latest version: ${(error as Error).message}`);

            throw error;
        }
    }

    public async update(id: string, data: Partial<AppVersion>): Promise<AppVersion> {
        this.logger.info(`Updating version => ${id}`);

        try {
            const version = await this.versionRepository.update(id, data);

            if (!version) {
                this.logger.warn(`Version with ID ${id} not found for update`);

                throw new VersionNotFoundException(id);
            }

            this.logger.info(`Version updated successfully => ${id}`);

            return version;
        } catch (error: unknown) {
            if (error instanceof VersionNotFoundException) throw error;

            this.logger.error(`Error updating version => ${id}: ${(error as Error).message}`);

            throw error;
        }
    }

    public async delete(id: string): Promise<boolean> {
        this.logger.info(`Deleting version => ${id}`);

        try {
            const deleted = await this.versionRepository.delete(id);

            if (!deleted) {
                this.logger.warn(`Version with ID ${id} not found for deletion`);

                throw new VersionNotFoundException(id);
            }

            this.logger.info(`Version deleted successfully => ${id}`);

            return true;
        } catch (error: unknown) {
            if (error instanceof VersionNotFoundException) throw error;

            this.logger.error(`Error deleting version => ${id}: ${(error as Error).message}`);

            throw error;
        }
    }

    public async incrementDownloads(id: string): Promise<void> {
        this.logger.info(`Recording download for version => ${id}`);

        try {
            const version = await this.versionRepository.findById(id);

            if (!version) {
                this.logger.warn(`Version with ID ${id} not found for download recording`);

                throw new VersionNotFoundException(id);
            }

            await this.versionRepository.incrementDownloads(id);

            this.logger.info(`Download count incremented for version => ${id}`);
        } catch (error: unknown) {
            if (error instanceof VersionNotFoundException) throw error;

            this.logger.error(`Error recording download for version => ${id}: ${(error as Error).message}`);

            throw error;
        }
    }

    public async findPaginated(page: number, limit: number): Promise<{
        data: AppVersion[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        this.logger.info(`Finding paginated versions (page: ${page}, limit: ${limit})`);

        try {
            return await this.versionRepository.findPaginated(page, limit);
        } catch (error: unknown) {
            this.logger.error(`Error finding paginated versions: ${(error as Error).message}`);

            throw error;
        }
    }
}