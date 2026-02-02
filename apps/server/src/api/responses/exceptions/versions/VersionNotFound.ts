/**
 * @file VersionNotFoundException.ts
 * @description Custom exception class used to indicate that the requested version was not found.
 * @author Lucas
 * @license Apache-2.0
 */

import { ApiErrorCodes } from '@vsa/core';
import { BaseException } from '../Base';

export class VersionNotFoundException extends BaseException {
    constructor(identifier: string, details?: string[]) {
        super(
            ApiErrorCodes.VERSION_NOT_FOUND,
            details || [`Version ${identifier} not found`]
        );
    }
}