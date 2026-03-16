/**
 * @file NoActiveVersionsException.ts
 * @description Custom exception class used to indicate that no active versions are currently available.
 * @author Lucas
 * @license Apache-2.0
 */

import { ApiErrorCodes } from '@vsa/core';
import { BaseException } from '../Base';

export class NoActiveVersionsException extends BaseException {
    constructor(details?: string[]) {
        super(ApiErrorCodes.NO_ACTIVE_VERSIONS, details || ['No active versions found']);
    }
}
