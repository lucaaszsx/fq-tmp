/**
 * @file index.ts
 * @description Central export hub for all exception classes and API response utilities for simplified imports across the application layer. Includes custom exceptions, API response formatters, codes, and HTTP mappings.
 * @author Lucas
 * @license Apache-2.0
 */

/** Exceptions */

// Base
export { BaseException } from './exceptions/Base';

// ────────────────────────────────
// Domain
// ────────────────────────────────
export { NotFoundException } from './exceptions/domain/NotFound';

// ────────────────────────────────
// Infrastructure / Internal
// ────────────────────────────────
export { InternalErrorException } from './exceptions/infra/InternalError';

// ────────────────────────────────
// Rate Limiting / Preventions
// ────────────────────────────────
export { TooManyRequestsException } from './exceptions/preventions/TooManyRequests';

// ────────────────────────────────
// Version Management
// ────────────────────────────────
export { VersionAlreadyExistsException } from './exceptions/versions/VersionAlreadyExists';
export { NoActiveVersionsException } from './exceptions/versions/NoActiveVersions';
export { VersionNotFoundException } from './exceptions/versions/VersionNotFound';

/** API Response handler */
export * from './ApiResponse';
