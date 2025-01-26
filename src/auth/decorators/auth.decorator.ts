import { applyDecorators, UseGuards } from "@nestjs/common";
import { Role } from "../../common/enums/rol.enum";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "../guard/roles.guard";
import { AuthGuard } from "../guard/auth.guard";

// El applyDecorators lo que hace es Juntar varios decoradores
// y le quitamos el @ de delante...
export function Auth(role: Role){
// Roles(role): Le inserta el Role en el Metadato al request
// AuthGuard: Extrae el token que viene en el Header del request, SE VERIFICA el token y se adiciona en el request el payload ( en este caso el user)
// RolesGuard: Extrae el Role del Metadato que hemos insertado previamente con Roles(role), Extrae el payload que hemos insertado previamente en AuthGuard y que tiene la información del user, y 
// VERIFICA si el role que le hemos insertado en el Metadato con Roles(role) coinside con la que viene desde el header en forma de JWTtoken encriptado y que viene con la informacion del usuario.
// Acordarnos que cuando hacemos login creamos este JWTtoken encriptado con la información del user, ver archivo "auth.service.ts" function login donde creo el JWT token 
// con el payload = {email: user.email, role: user.role}
//
return applyDecorators(Roles(role), UseGuards(AuthGuard, RolesGuard));
}