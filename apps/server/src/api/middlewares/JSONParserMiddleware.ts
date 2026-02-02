/**
 * @file JSONParserMiddleware.ts
 * @description Parses incoming request bodies with JSON payloads, making them
 * available under `req.body`. Should be applied before any route handling or
 * request validation logic. Uses Express's built-in JSON parser internally.
 * Typically applied to handle API request bodies encoded as JSON.
 * @author Lucas
 * @license Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';
import { Middleware } from 'routing-controllers';
import { EnvConfig } from '@/config/env';
import { json } from 'body-parser';
import { Service } from 'typedi';

const { middlewares } = EnvConfig.Server;

@Middleware({ type: 'before' })
@Service()
export default class JSONParserMiddleware {
    private readonly parser: (req: Request, res: Response, next: NextFunction) => void;

    constructor() {
        this.parser = json({
            limit: middlewares.json.limit,      // prevents overly large request bodies
            strict: true,                       // only parses valid JSON
            inflate: middlewares.json.inflate   // supports gzip/deflate encoded bodies
        });
    }

    use(req: Request, res: Response, next: NextFunction): void {
        this.parser(req, res, next);
    }
}