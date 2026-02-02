/**
 * @fileoverview Middleware responsible for logging HTTP requests using Morgan.
 * Creates a log file and writes request logs using a writable stream; adjusts format based on environment.
 * @author Lucas
 * @license MIT
 */

import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { Request, Response, NextFunction } from 'express';
import morgan, { StreamOptions } from 'morgan';
import { Logger } from '../../lib/logger';
import { EnvConfig } from '@/config/env';
import { Service } from 'typedi';
import path from 'node:path';

const { Application } = EnvConfig;

@Middleware({ type: 'before' })
@Service()
export default class LoggerMiddleware implements ExpressMiddlewareInterface {
    private logger = new Logger(__filename);
    private readonly morganMiddleware;

    constructor() {
        const root = Application.dirs.logs;

        if (!existsSync(root)) mkdirSync(root);

        const fileStream = createWriteStream(path.join(root, Application.logs.fileName), { flags: 'a' });
        const stream: StreamOptions = {
            write: (message: any) => {
                fileStream.write(message + '\n');
                this.logger.info(message);
            }
        };

        const format = process.env.ENVIRONMENT === 'prod' ? 'combined' : 'dev';

        this.morganMiddleware = morgan(format, { stream });
    }

    use(req: Request, res: Response, next: NextFunction): void {
        this.morganMiddleware(req, res, next);
    }
}