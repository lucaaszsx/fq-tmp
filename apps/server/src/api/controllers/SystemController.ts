/**
 * @file SystemController.ts
 * @description Controller for application system status management.
 * @author Lucas
 * @license MIT
 */

import { JsonController, Get, Req } from 'routing-controllers';
import { PingResponse } from './responses/SystemResponses';
import { BaseController } from './BaseController';
import type { ApiResponse } from '@fc/core';
import type { Request } from 'express';
import { Service } from 'typedi';
console.log("Achou")
@Service()
@JsonController('/system')
export class SystemController extends BaseController {
    @Get('/ping')
    ping(@Req() req: Request): ApiResponse<PingResponse> {
        return this.ok<PingResponse>(req, {
            message: 'Pong! 🏓'
        });
    }
}