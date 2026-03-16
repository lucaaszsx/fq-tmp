/**
 * @file AuthResponses.ts
 * @description Response DTO classes for system endpoints
 * @author Lucas
 * @license MIT
 */

export class RegisterUserResponse {
    @Type(() => PrivateUser)
    @Expose()
    accessToken!: string;
}
