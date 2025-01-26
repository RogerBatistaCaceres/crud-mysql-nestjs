import { SetMetadata } from "@nestjs/common";
import { Role } from "../../common/enums/rol.enum";

// La idea es exportar esta constante para que pueda ser utilicada
// como Llave del Role.
export const ROLES_KEY = 'roles';
// Este SetMetadata() nos permite agregarle información al request que estamos
// solicitando, le estamos agregando una data adicional,
// Agrega metadatos personalizados..
// SetMetadata(key, value) es como un localstorage con un key y el valor.
// el valor viene desde afuera y se lo asigno en el metadata a la key 'roles'
export const Roles = (role: Role) => SetMetadata(ROLES_KEY, role);

// Este metadato que acabamos de insertar, en alguna parte tenemos que leerlo
// para permitir o no acceder a la ruta...