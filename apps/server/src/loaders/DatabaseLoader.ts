/**
 * @file DatabaseLoader.ts
 * @description Initializes PostgreSQL connection using TypeORM.
 * @author Lucas
 * @license MIT
 */

import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { dataSource } from '@/database/dataSource';
import { Logger } from '@/lib/logger';

export const DatabaseLoader: MicroframeworkLoader = async (
    settings?: MicroframeworkSettings
): Promise<void> => {
    const logger = new Logger(__filename);

    try {
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