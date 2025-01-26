import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // El auth.services.ts, es el que se tiene que conectar con nuestro módulo User.services,
    // tiene que traerse todos los métodos del user.services y se hace inyectando la siguiente linea
  
    // Con esto no es suficiente, ahora tenemos que ir al módulo usersServices y decirle
    // que el módulo AuthService lo va a utilizar, por eso tenemos que ir al users.module
    // y exportar el servicio UsesService, para que lo utilicen.
    private readonly usersService: UsersService,

    // con esta otra linea inyectamos el servicio de JWT token para la autenticacion,
    // para poder utilizar este servicio, ahora también debemos importarlo en el
    // módulo.

    private readonly jwtService: JwtService
   ) {}    
  
  async register_1(registerDto: RegisterDto){
    const user = await this.usersService.findOnebyEmail(registerDto.email)
    if (user){
        // para tirar el típico error usar la función Error, pero como estamos en nest
        // es mejor utilizar su motor de tratamiento de errores..
        // throw new Error('User already exists'); // y detiene la ejecución de las próximas lineas

        // Exceptions in nest,   https://docs.nestjs.com/exception-filters
        // esto crea un error ya controlado por nest
        throw new BadRequestException('User already exists'); // y detiene la ejecución de las próximas lineas
    }
    return await this.usersService.create(registerDto)
  }
  
  // Otra forma es usando la desestructuración a lo React (javascript),
  // permite desempacar valores de arreglos o propiedades, 
  // igual que un prox en React.
  async register({name, email, password}: RegisterDto){
      const user = await this.usersService.findOnebyEmail(email)
      if (user){
        // para tirar el típico error usar la función Error, pero como estamos en nest
        // es mejor utilizar su motor de tratamiento de errores..
        // throw new Error('User already exists'); // y detiene la ejecución de las próximas lineas
        
        // Exceptions in nest,   https://docs.nestjs.com/exception-filters
        // esto crea un error ya controlado por nest
        throw new BadRequestException('User already exists'); // y detiene la ejecución de las próximas lineas
    }
    await this.usersService.create({
        name, 
        email, 
        password: await bcryptjs.hash(password,10) // el 10 son palabras aleatorias para general el hash, para si dos contraseñas son iguales se creen diferentes Hash
    });

    // y ahora devuelvo lo que realmente quiero, y no todo lo que me devuelve el create..
    // esto lo hago para no devolver el usuario.
    return {
      name,email,
    };
  }
    

  async login({email, password}: LoginDto){
    const user = await this.usersService.findOnebyEmailWithPassword(email)
    if (!user){
        // para tirar el típico error usar la función Error, pero como estamos en nest
        // es mejor utilizar su motor de tratamiento de errores..
        // throw new Error('User already exists'); // y detiene la ejecución de las próximas lineas
        
        // Exceptions in nest,   https://docs.nestjs.com/exception-filters
        // esto crea un error ya controlado por nest
        throw new UnauthorizedException('email is wrong'); // y detiene la ejecución de las próximas lineas
    }
    // si el usuario existe entonces continuo para comparar la contraseña..
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid){
        // para tirar el típico error usar la función Error, pero como estamos en nest
        // es mejor utilizar su motor de tratamiento de errores..
        // throw new Error('User already exists'); // y detiene la ejecución de las próximas lineas
        
        // Exceptions in nest,   https://docs.nestjs.com/exception-filters
        // esto crea un error ya controlado por nest
        throw new UnauthorizedException('password is wrong'); // y detiene la ejecución de las próximas lineas
    }

    // Ahora generamos el JWT Token, y ponemos los datos que van a viajar en el token
    // Importante; en el payload no debe viajar información confidencial
    // porque el contenido de este JWTtoken se puede sacar desde la siguiente 
    // pagina WEB : https://jwt.io/
    const payload = {email: user.email, role: user.role};
    const token = await this.jwtService.signAsync(payload)
    return {
      token,
      email
    };
    // con ese token, entonces el usuario tiene que reenviar ese token 
    // cada vez que quieran una ruta que necesiten autorización.
    // Autenticar, -> significa que el usuario y ese password sea correcta y le devolvemos un token
    // Autorizar, ->  significa que cuando queremos visitar una ruta que sea con privilegios, 
    // el usuario con ese token está autorizado a entrar en esa ruta.
  }

  async profile({email, role}: {email: string; role: string}){
    // Pero esto hay que optimizarlo, porque cada vez que tenemos que 
    // autorizar una ruta no debemos escribir el mismo código siempre, 
    // por eso esta opción no es muy viable.
    // Lo suyo es usar los SetMetadata... usar un decorador Guard personalizado ...
    // if (role !== 'admin'){
    //  throw new UnauthorizedException('You are not authorized to access this resource',);
    // } 
      return await this.usersService.findOnebyEmail(email);
  }


}
