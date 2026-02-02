/**
 * @file ServerLoader.ts
 * @description Configures the Winston logger and loads it into the microframework context. Applies different formatting for development and production environments. Enhances error visibility and stack trace formatting for better debugging and observability. Executed during the application boot process as a MicroframeworkLoader component.
 * @author Lucas
 * @license Apache-2.0
 */

import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { Application as ExpressApplication } from 'express';
import { createExpressServer } from 'routing-controllers';
import { EnvConfig } from '@/config/env';
import { Logger } from '@/lib/logger';

export const ServerLoader: MicroframeworkLoader = async (
    settings?: MicroframeworkSettings
): Promise<void> => {
    const app: ExpressApplication = createExpressServer({
        routePrefix: EnvConfig.Server.routePrefix,
        defaultErrorHandler: false,
        classTransformer: true,
        validation: true,
        cors: false,
        controllers: [EnvConfig.Application.dirs.controllers],
        middlewares: [EnvConfig.Application.dirs.middlewares],
    });

    // Configure trust proxy for proper IP detection when behind proxies (Vercel, nginx, load balancers)
    if (EnvConfig.Environment.node === 'prod') app.set('trust proxy', true);

    const logger: Logger = new Logger(__filename);
    const { port } = EnvConfig.Server;
    const server = app.listen(port, '0.0.0.0', () => {
        logger.info(`Server started on port ${port}.`);
    });

    if (settings) {
        settings.onShutdown(() => server.close());
        settings.setData('server', server);
        settings.setData('app', app);
    }
};