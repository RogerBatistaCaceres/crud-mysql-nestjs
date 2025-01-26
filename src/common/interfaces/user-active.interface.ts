// esta interface que me he creado es lo que viaja en el payload
// cuando hacemos login, es lo que se utiliza para meterlo en el JWTtoken 
// y encriptarlo
export interface UserActiveInterface {
    email: string;
    role: string;
}