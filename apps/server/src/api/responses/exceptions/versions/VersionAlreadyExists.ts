/**
 * @file VersionAlreadyExistsException.ts
 * @description Custom exception class used to indicate that a version with the specified identifier already exists.
 * @author Lucas
 * @license Apache-2.0
 */

import { ApiErrorCodes } from '@vsa/core';
import { BaseException } from '../Base';

export class VersionAlreadyExistsException extends BaseException {
    constructor(version: string, details?: string[]) {
        super(
            ApiErrorCodes.VERSION_ALREADY_EXISTS,
            details || [`Version ${version} already exists`]
        );
    }
}
