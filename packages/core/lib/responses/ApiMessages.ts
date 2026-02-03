/**
 * @file ApiMessages.ts
 * @description Maps internal API error codes to user-friendly error messages.
 *
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from './ApiCodes';

export const ApiErrorMessages: Record<ApiErrorCodes, string> = {
    // ────────────────────────────────
    // General / Server Errors
    // ────────────────────────────────
    [ApiErrorCodes.INTERNAL_SERVER_ERROR]:
        'Internal server error encountered during request processing',
    [ApiErrorCodes.TOO_MANY_REQUESTS]: 'Rate limit exceeded due to excessive request frequency',
    [ApiErrorCodes.SERVICE_UNAVAILABLE]:
        'Service is currently unavailable due to maintenance or overload',
    [ApiErrorCodes.NOT_IMPLEMENTED]:
        'Requested functionality is not available in the current version',
    [ApiErrorCodes.BAD_GATEWAY]: 'Failed to establish a valid response from the upstream server',
    [ApiErrorCodes.NOT_FOUND]: 'Requested endpoint does not exist on this server',

    // ────────────────────────────────
    // Validation Errors
    // ────────────────────────────────
    [ApiErrorCodes.VALIDATION_FAILED]: 'Input validation failed for one or more fields',

    // ────────────────────────────────
    // Version Management Errors (2200-2299)
    // ────────────────────────────────
    [ApiErrorCodes.VERSION_NOT_FOUND]: 'The requested version was not found',
    [ApiErrorCodes.VERSION_ALREADY_EXISTS]: 'A version with this identifier already exists',
    [ApiErrorCodes.NO_ACTIVE_VERSIONS]: 'No active versions are currently available'
};