import { IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateCatDto {
// DTO -> Data Transfer Object
// aca va a estar la información que nosotros vamos a permitir desde el frontend hacia el controlador
// es para mapear la inforamación que nos llega desde el cliente al servidor

// Tambien nos sirve para validar los datos que nos envian desde el Frontend

// Aca solo vamos a poner la información que queremos recibir, para el create del Cat.

// Todo esto se puede hacer porque nosotros desde el archivo main.ts hicimos el ValidationPipes

@IsString()
@MinLength(1)
name: string;

@IsInt()
@IsPositive()
age: number;

@IsString()
@IsOptional()
breed?: string;     // ? es para decir que este parámetro puede ser opcional

}
