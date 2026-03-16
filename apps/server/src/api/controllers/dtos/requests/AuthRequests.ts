import { IsRequiredEmail, IsRequiredString } from '@/decorators';
import { UserRules } from '@fc/core';

export class RegisterUserRequest {
    @IsRequiredString(UserRules.NAME.MIN_LENGTH, UserRules.NAME.MAX_LENGTH, UserRules.NAME.REGEX)
    public name!: string;

    @IsRequiredEmail()
    public email!: string;

    @IsRequiredString(
        UserRules.PASSWORD.MIN_LENGTH,
        UserRules.PASSWORD.MAX_LENGTH,
        UserRules.PASSWORD.REGEX.FULL
    )
    public password!: string;
}
