import { DataSourceOptions, DataSource } from 'typeorm';
import { EnvConfig } from '@/config/env';

const options: DataSourceOptions = {
    type: EnvConfig.Database.type,
    host: EnvConfig.Database.host,
    port: EnvConfig.Database.port,
    username: EnvConfig.Database.username,
    password: EnvConfig.Database.password,
    database: EnvConfig.Database.database,

    synchronize: EnvConfig.Database.synchronize,

    migrationsRun: true,
    entities: EnvConfig.Application.dirs.entities,
    migrations: EnvConfig.Application.dirs.migrations,

    logging: EnvConfig.Database.logging
};

export const appDataSource = new DataSource(options);