import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
// Este método se ejecuta antes de que se procese una solicitud
// hacia una ruta o endpoint especifico, la función canActive devuelve
// un valor booleano o una promesa que resuelve a un valor booleano.
// Dependiendo del resultado de esta función, se permitirá o se denegará
// el acceso al endipoint protegido.
// O sea cuando llamemos a este Guard lo que hay dentro del canActive es lo
// que se va a procesar antes de la ruta en cuestion, es como
// un middleware, se hace esta función antes de que pase a la
// siguiente ruta.
export class AuthGuard implements CanActivate {

  constructor(
    // inyecto esta propiedad para poder acceder al servicio 
    // JwtService de nest dentro de esta clase
    private readonly jwtService: JwtService
  ){}

  async canActivate( context: ExecutionContext): Promise<boolean> {
    // El request es lo que envía el cliente..
    // request.body, request.query (viene desde la url), request.authorization
    const request = context.switchToHttp().getRequest();
    //console.log(request.headers.authorization);
    // Podemos ver que en el "request.headers.authorization" estamos recibiendo ese Token
    // Ahora tenemos que validar que ese token sea verdadero ...
    
    //Ahora utilizamos el método privado que hemos creado "extractTokenFromHeader"
    const token = this.extractTokenFromHeader(request);
    // si no exixte el token todo termina en la linea "UnauthorizedException()"
    // y el código no continúa.
    if (!token){
       throw new UnauthorizedException()
    }
   // Cuando llega aca (a esta linea) es porque el token existe
   // por lo que tengo que verificar que sea el correcto, con la pabra
   // secreta que hemos creado en "auth\constants\jwt.constant.ts"
   // el jwtService tenemos que menterlo en el constructor, por eso tenemos
   // que redefinir el constructor para que puede llamar a ese servicio
   // verificamos si el "token" que envia el cliente es igual al secreto que se 
   // encuentra en la constante que creamos..
    try {
      const payload = await this.jwtService.verifyAsync(token 
        // Realmente no hace falta esta línea porque la palabra clave es una variable Global que viene en el servicio JWT
        //,{
        //  secret: jwtConstants.secret
        //}
      );
      // en caso de que el "token" encriptado que envía el usuario
      //  y la palabra secreta coincidan, entonces 
      
      // Al request (lo que devolvemos) nosotros podemos añadirle propiedades..
      // Le estamos inyectando en el request una propiedad nueva
      // llamada 'user', y ese user va a tener el payload.
      // el payload es la información pública que se puede sacar de 
      // desencriptar el Jwttoken, en nuestro caso le estamos enviando
      // el email de ese token... porque así es como lo hemos formado 
      // en el archivo "auth.service.ts"->login
      // Este JWTtoken que hemos creado con el email se puede
      // sacar (recuperar) en el siguiente sitio WEB y está creado 
      // con alg:HS256, typ: JWT
      // https://jwt.io/
      //
      // a parte de venir todo lo que viene, yo le estoy 
      // adicionando (creando) esta propiedad al request..
      // request['user'] = payload;  // esto es una forma
      request.user = payload; // esto es otra forma de escribir lo mismo
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  // vamos a implementar un metodo privado que se llama extractTokenFromHeader
  // Este Request debe de venir importado de la biblioteca'express' para que este validado..
  // de lo contrario me da error...
  // el token llega en formato:
  // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI
  // y el split es para separar la palabra Bearer del token..
  // y los convierte en arreglos, en el indice 0 del arreglo me deja la palabra 'Bearer'
  // y en el indice 1 del arreglo me deja el token, el primer indice es
  // el tipo de tipo 'Bearer' (Portadora), y el segundo tipo es el token
  // el primer caracter ? después de la palabra authorization, lo que me hace es que 
  // si el split no puede ejecutarse bien por alguna razon, por ejemplo que no me 
  // llegue la palabra 'Bearer' entonces no va a seguir con el código que viene..
  // es decir si no existe la propiedad "request.headers.authorization"
  // entonces no hace el split...y devuelve un string vacio []
  private extractTokenFromHeader(request: Request): string | undefined{
   const [type, token] = request.headers.authorization?.split(' ') ?? [];
   return type === 'Bearer' ? token : undefined; 
  }
}
