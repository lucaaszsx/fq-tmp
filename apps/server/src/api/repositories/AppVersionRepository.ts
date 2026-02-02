/**
 * @file AppVersionRepository.ts
 * @description Repository layer for AppVersion entity operations. Provides type-safe database queries with common CRUD operations.
 * @author Lucas
 * @license Apache-2.0
 */

import { ensureConnection } from '@/loaders/DatabaseLoader';
import { AppVersion } from '../models/AppVersionEntity';
import { Repository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export class AppVersionRepository {
    private repository: Repository<AppVersion>;

    constructor() {
        const dataSource = ensureConnection();

        this.repository = dataSource.getRepository(AppVersion);
    }

    async create(data: Partial<AppVersion>): Promise<AppVersion> {
        const version = this.repository.create(data);

        return this.repository.save(version);
    }

    async findById(id: string): Promise<AppVersion | null> {
        return this.repository.findOne({ where: { id } });
    }

    async findByVersion(version: string): Promise<AppVersion | null> {
        return this.repository.findOne({ where: { version } });
    }

    async findAll(): Promise<AppVersion[]> {
        return this.repository.find({
            where: { isActive: true },
            order: { versionCode: 'DESC' }
        });
    }

    async findLatest(): Promise<AppVersion | null> {
        return this.repository.findOne({
            where: { isActive: true, isPreRelease: false },
            order: { versionCode: 'DESC' }
        });
    }

    async update(id: string, data: Partial<AppVersion>): Promise<AppVersion | null> {
        await this.repository.update(id, data);

        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.update(id, { isActive: false });

        return result.affected !== undefined && result.affected > 0;
    }

    async incrementDownloads(id: string): Promise<void> {
        await this.repository.increment({ id }, 'downloadCount', 1);
    }

    async findPaginated(page: number, limit: number): Promise<{
        data: AppVersion[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const skip = (page - 1) * limit;

        const [data, total] = await this.repository.findAndCount({
            skip,
            take: limit,
            order: { versionCode: 'DESC' }
        });

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}