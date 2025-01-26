export class CreateUserDto {
    email: string;
    password: string;
    name?: string;  // ? con este signo interrogación es para dejarlo opcional
}
