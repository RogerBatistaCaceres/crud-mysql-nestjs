import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../common/enums/rol.enum';

// Para acceder a los metadatos establecidos con el decorador @SetMetadata en el decorador
// o sus métodos, se usa el módulo Reflector
// Para leer los metadatos necesitamos el módulo Reflector, El Reflector te permitirá leer los metadatos
// adjuntados a los Request en tiempo de ejecución

@Injectable()
export class RolesGuard implements CanActivate {

  constructor (private readonly reflector: Reflector){}

  canActivate(
    context: ExecutionContext,
  ): boolean  {
    // Este reflector es el que nos va a permitir leer el role que viene en el metadato
    // es como estar cogiendo información del localstore, donde le pasamos el key que queremos leer
    // con <Role> le decimos que lo que devuelva sea de tipo Role.
    const role = this.reflector.getAllAndOverride <Role> (ROLES_KEY,[
      context.getHandler(),
      context.getClass()
    ]) 
    // Esto se hace para las rutas que no necesiten roles para que no 
    // En caso de que no hayan roles este guard no necesita ejecutarse por 
    // lo que los roles devuelven true
    if(!role){
      return true;
    }
    // si hacemos un console log de roles debemor recibir el role del usuario que metimos en el
    // metadato @Roles('user') en el "auth.controller.ts" y es el que debemos comparar con...
    // deberiamos estar viendo en esos roles lo que metimos en el metadato.
    //console.log(role);

    // ahora necesitamos desde este Guard acceder al request del usuario, donde viene
    // el metadato que hemos inyectado previamente, en el AuthGuard() en el archivo auth.guard.ts.
    // aqui estoy recibiendo el payload "request.user = payload", que se insertó después de haber desencriptado
    // correctemente el token y haber cogido el usuario que venia dentro del JWTtoken encriptado.
    // payload = {email: user.email, role: user.role} este paiy load se crea cuando se hace login en el archivo "auth.services.ts"
    const {user} = context.switchToHttp().getRequest();

    // con esta otra linea lo que hacemos es que si el usuario que entra
    // tiene el Role de administrador, entonces que siempre le permita pasar...
    if(user.role === Role.ADMIN){
      return true;
    }

    // Si el role que viene del Metadato encriptado dentro del JWT Token
    // es igual al role que viene del usuario cuando este hace login..
    // entonces lo dejo pasar. 
    return role === user.role
  }
}
