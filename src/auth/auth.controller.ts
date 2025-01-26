import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Request } from 'express';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { ApiTags } from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  }
}

@ApiTags('auth') // Utilizado por swagger (para documentar el API), para organizar por Tags
@Controller('auth')

export class AuthController {
  // Para poder utilizar el sevicio tenemos que inyectarlo,
  // entonces redefinimos el constructor para adicionar la propiedad
  // que nos permita acceder a los servicios
  constructor(
      private readonly authService: AuthService,
  ){}

  @Post('register')
  // En el register necesitamos capturar ese Body que nos envian desde 
  // el frontend y lo hacemos a traves de otro controlador (decorador) @Body
  // Si las validaciones de datos fallan no debe de llegar al authService.register
  register(@Body() registerDto: RegisterDto){
    // console.log(registerDto)
      return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto){
    return this.authService.login(loginDto);
  }

  @Get('profile3')
  // Creamos un nuevo decorador (personalizado, que no existe en nest) 
  // con el nombre de Roles, con la idea de se ponga...
  // esta ruta necesita el role de 'admin' ó esta ruta necesita el 
  // Role de 'user', ó el role de 'superuser', etc, etc..
  // Como este decorador no existe lo creamos en una carpeta aparte para
  // ser más ordenados, carpeta decorators\roles.decorator.ts
  // Cuando nosotros estamos haciendo un request a esta ruta, además
  // le estamos adicionando esta data adicional (metadata) con este nuevo decorador..
  // nest g guard auth/guard/roles --flat

  @Roles(Role.USER)   // @Roles('admin')  @Roles('superuser')

  // Este metadato que acabamos de insertar, en alguna parte tenemos que leerlo
  // para comparar esa información, es decir lo que me trae el JWTtoken tiene 
  // que coincidir con la palabra que yo le he adicionado con los metadatos
  // al request... y permitir el acceso a la ruta, o no...

  // Los que hacen esta operación de permitir el acceso a una ruta
  // son los Guard...Por lo tanto tenemos que crearnos un Guard personalizado..
  // Para leer la metadata que la acabamos de incorporar al request 
  // y compararla con la información del usuario.
  // nest g guard auth/guard/roles --flat


  // Para activar el Guard, llamamos a un decorador especial
  // que nos permita proteger esa ruta...con ese guard...
  // ahora cada vez que queremos entrar en el profile va a entrar en 
  // el UseGuard y va a ejecutar el controlador AuthGuard que hemos creado.
  @UseGuards(AuthGuard, RolesGuard)
  profile3(
    // este decorador "@Request()" es para recibir el request que viene
    // desde el client, y el que yo finalmente le envío.., 
    // que lo lleno, por ejemplo desde el archivo auth.guard.ts
    // donde le adiciono el "request.user = payload;" desde el metodo
    // canActivate que me permite darle autorización a una ruta...
    // en este caso la ruta profile...
    // http://localhost:3000/api/v1/auth/profile

    // De esta misma forma funcionan los middleware en express
    // la explicación esta en el siguiente enlace 1:36:30
    //https://www.youtube.com/watch?v=Z6G7mCAeXoE&list=PLPl81lqbj-4LqA6sXRETXUg4uNkYG4aUc&index=2

    // https://www.youtube.com/watch?v=TZ4P0DEfuys&list=PLPl81lqbj-4LqA6sXRETXUg4uNkYG4aUc&index=4
    // con esto lo que hacemos es crear un nuevo decorador que herede del decorador @Request
    // y que además le adicione el user y el role...
    // lo correcto es hacer esto una interface
    @Req()
    // Esta linea la convertimos en una interface llamada RequestWithUser
    // y que la hemos implementado arriba
    // Realmente este req es una unión de todo lo que viene en el Request
    // de Express que viene por defecto, y nosotros le estamos inyectando 
    // el usuario con el email y el role...
    // El "Login" y el "Register" no lo necesita, solo lo van a necesitar
    // las rutas protegidas, que sabemos viene la información del usuario.
    // req : Request & {user: {email: string; role: string}},
    
    req: RequestWithUser,
  ){
   // return 'profile'
   //return req.user;
   return this.authService.profile(req.user);
  }

  // Esta otra ruta es parecida a la anterior pero sin los comentarios
  @Get('profile2')
  @Roles(Role.USER)   
  @UseGuards(AuthGuard, RolesGuard)
  profile2( @Req() req: RequestWithUser){
   return this.authService.profile(req.user);
  }

  // Esta otra ruta es parecida a la anterior pero haciendo uso
  // de la union de varios decoradores con @Auth() que une AuthGuard, RolesGuard
  @Get('profile4')
  @Auth(Role.USER)   
  profile4( @Req() req: RequestWithUser){
   return this.authService.profile(req.user);
  }

  // Esta otra ruta es parecida a la anterior pero haciendo uso
  // de un nuevo decorador personalizado @ActiveUser
  //  para que me devuelva el usuario
  @Get('profile')
  @Auth(Role.USER)   
  profile(@ActiveUser() user: UserActiveInterface){
   return this.authService.profile(user);
  }


}
