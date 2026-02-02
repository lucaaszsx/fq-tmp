/**
 * @file DatabaseLoader.ts
 * @description Initializes PostgreSQL connection using TypeORM.
 * @author Lucas
 * @license MIT
 */

import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { DataSource, DataSourceOptions } from 'typeorm';
import { EnvConfig } from '@/config/env';
import { Logger } from '@/lib/logger';

let dataSource: DataSource | null = null;

export const DatabaseLoader: MicroframeworkLoader = async (
    settings?: MicroframeworkSettings
): Promise<void> => {
    if (dataSource?.isInitialized) return;

    const logger = new Logger(__filename);

    try {
        const options: DataSourceOptions = {
            type: EnvConfig.Database.type,
            host: EnvConfig.Database.host,
            port: EnvConfig.Database.port,
            username: EnvConfig.Database.username,
            password: EnvConfig.Database.password,
            database: EnvConfig.Database.database,

            // important!
            synchronize: EnvConfig.Database.synchronize,

            migrationsRun: true,
            entities: EnvConfig.Application.dirs.entities,
            migrations: EnvConfig.Application.dirs.migrations,

            logging: EnvConfig.Database.logging
        };

        dataSource = new DataSource(options);
        await dataSource.initialize();

        logger.info('Database connection established');

        if (settings) {
            settings.setData('dataSource', dataSource);

            settings.onShutdown(async () => {
                if (dataSource?.isInitialized) {
                    await dataSource.destroy();
                    logger.info('Database connection closed');
                }
            });
        }
    } catch (error) {
        logger.error('Failed to initialize database connection', error);
        throw error;
    }
};

/**
 * Ensure database connection is available.
 * This must be used in repositories and services.
 */
export const ensureConnection = (): DataSource => {
    if (!dataSource || !dataSource.isInitialized)
        throw new Error('Database connection not initialized');

    return dataSource;
};
