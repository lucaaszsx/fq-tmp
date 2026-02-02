/**
 * @file BaseController.ts
 * @description Abstract class for all controllers. It has some methods to handle controllers responses to requests.
 * @author Lucas
 * @license MIT
 */

import type { Request as ExpressRequest } from 'express';
import { createApiResponse } from '../responses';
import { ApiSuccessCodes } from '@fc/core';

export abstract class BaseController {
    protected ok<T>(request: ExpressRequest, data: T) {
        return createApiResponse<T>({
            apiCode: ApiSuccessCodes.OK,
            path: request.path,
            data
        });
    }
    
    protected created<T>() {}
    protected deleted<T>() {}
    protected noContent<T>() {}
}