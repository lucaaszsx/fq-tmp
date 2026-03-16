/**
 * @file ApiCodes.ts
 * @description Centralized API response codes used for internal application logic.
 * These are NOT HTTP status codes, but internal identifiers used in the API responses.
 *
 * Success codes start from 1000+ (<2000)
 * Error codes start from 2000+ (<3000)
 *
 * @author Lucas
 * @license MIT
 */

/**
 * @enum ApiSuccessCodes
 * @description Internal API success codes. All codes must be >= 1000.
 */
export enum ApiSuccessCodes {
    // ────────────────────────────────
    // General Success (1000–1099)
    // ────────────────────────────────
    OK = 1000,
    CREATED = 1001,
    UPDATED = 1002,
    ACCEPTED = 1003,
    DELETED = 1004
}

/**
 * @enum ApiErrorCodes
 * @description Internal API error codes. All codes must be >= 2000.
 */
export enum ApiErrorCodes {
    // ────────────────────────────────
    // General / Server Errors (2000–2099)
    // ────────────────────────────────
    INTERNAL_SERVER_ERROR = 2000,
    TOO_MANY_REQUESTS = 2001,
    SERVICE_UNAVAILABLE = 2002,
    NOT_IMPLEMENTED = 2003,
    BAD_GATEWAY = 2004,
    NOT_FOUND = 2005,

    // ────────────────────────────────
    // Validation Errors (2100–2199)
    // ────────────────────────────────
    VALIDATION_FAILED = 2100,

    // ────────────────────────────────
    // Version Management Errors (2200-2299)
    // ────────────────────────────────
    VERSION_NOT_FOUND = 2200,
    VERSION_ALREADY_EXISTS = 2201,
    NO_ACTIVE_VERSIONS = 2202
}
