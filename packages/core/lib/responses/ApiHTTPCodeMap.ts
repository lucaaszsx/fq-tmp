/**
 * @file ApiHTTPCodeMap.ts
 * @description Maps internal API codes to corresponding HTTP status codes.
 *
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes, ApiSuccessCodes } from './ApiCodes';
import { StatusCodes } from 'http-status-codes';

export const ApiHTTPCodeMap: Record<number, StatusCodes> = {
    // ────────────────────────────────
    // Success Codes
    // ────────────────────────────────

    // General Success
    [ApiSuccessCodes.OK]: StatusCodes.OK,
    [ApiSuccessCodes.CREATED]: StatusCodes.CREATED,
    [ApiSuccessCodes.ACCEPTED]: StatusCodes.ACCEPTED,
    [ApiSuccessCodes.NO_CONTENT]: StatusCodes.NO_CONTENT,

    // ────────────────────────────────
    // Error Codes
    // ────────────────────────────────

    // General / Server Errors
    [ApiErrorCodes.INTERNAL_SERVER_ERROR]: StatusCodes.INTERNAL_SERVER_ERROR,
    [ApiErrorCodes.TOO_MANY_REQUESTS]: StatusCodes.TOO_MANY_REQUESTS,
    [ApiErrorCodes.SERVICE_UNAVAILABLE]: StatusCodes.SERVICE_UNAVAILABLE,
    [ApiErrorCodes.NOT_IMPLEMENTED]: StatusCodes.NOT_IMPLEMENTED,
    [ApiErrorCodes.BAD_GATEWAY]: StatusCodes.BAD_GATEWAY,
    [ApiErrorCodes.NOT_FOUND]: StatusCodes.NOT_FOUND,
    
    // Validation Errors
    [ApiErrorCodes.VALIDATION_FAILED]: StatusCodes.BAD_REQUEST,

    // Version Management Errors
    [ApiErrorCodes.VERSION_NOT_FOUND]: StatusCodes.NOT_FOUND,
    [ApiErrorCodes.VERSION_ALREADY_EXISTS]: StatusCodes.CONFLICT,
    [ApiErrorCodes.NO_ACTIVE_VERSIONS]: StatusCodes.NOT_FOUND
};