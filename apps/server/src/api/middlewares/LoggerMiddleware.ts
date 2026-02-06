/**
 * @fileoverview Middleware responsible for logging HTTP requests using Morgan.
 * @author Lucas
 * @license MIT
 */

import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { EnvConfig } from '@/config/env';
import { Logger } from '@/lib/logger';
import { Service } from 'typedi';
import morgan from 'morgan';

@Middleware({ type: 'before' })
@Service()
export default class LoggerMiddleware implements ExpressMiddlewareInterface {
    private logger = new Logger(__filename);
    private readonly morganMiddleware;

    constructor() {
        const format =
            EnvConfig.Environment.node === 'prod'
                ? ':method :url :status :response-time ms - :res[content-length]'
                : 'dev';

        this.morganMiddleware = morgan(format, {
            stream: {
                write: (message: string) => {
                    this.logger.http(message.trim());
                }
            }
        });
    }

    use(req: Request, res: Response, next: NextFunction): void {
        this.morganMiddleware(req, res, next);
    }
}