import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto{
   
   // el transform debe de ejecutarse antes de las otras validaciones..
   /// para eliminar los espacios en blanco, eso lo hace la función trim()
   @Transform(({value})=> value.trim())   
   @IsString()   // que viene de la biblioteca class-validator, para validar esta entrada de datos
   @MinLength(1)   
   name: string;

   @IsEmail()
   email: string;

   // el transform debe de ejecutarse antes de las otras validaciones..
   /// para eliminar los espacios en blanco, eso lo hace la función trim()
   @Transform(({value})=> value.trim())   
   @IsString()   
   @MinLength(6)  
   password:string; 
}