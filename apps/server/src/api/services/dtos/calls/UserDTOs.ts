export class CreateUserDTO {
    public name!: string;
    public email!: string;
    public password!: string;
}

export class ExistsDTO {
    public id?: string;
    public email?: string;
}