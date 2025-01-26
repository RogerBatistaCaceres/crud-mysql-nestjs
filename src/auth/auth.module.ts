import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from './constantants/jwt.constant';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
    UsersModule,
    // En este caso la palabra secreta SI se guarda en una variable de entorno en el archivo .env
    // con la clave JWT_SECRET.
    // Se usa este código y NO el de abajo , ya que las variables de entorno
    // no se han cargado todavía cuando llegue hasta aca, por eso es que 
    // hay que usar el "async", como en esta parte y no la que está comentada.. 
    // Todo esto está mejor explicado en el minuto 53:10 de este video:
    // https://www.youtube.com/watch?v=H1dhlz7zAuo&list=PLPl81lqbj-4LqA6sXRETXUg4uNkYG4aUc&index=6
    JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),  // JWT_SECRET es una variable de entorno que está en el archivo .env
      global: true,   // que es una variable global y se podrá llamar en cualquier parte del proyecto
      signOptions: {expiresIn:'1d'},  // '60s' segundos, '1d' un día
    }),
    inject: [ConfigService],
    }) 
  ],  
  // En este caso la palabra secreta NO se guarda en una variable de entorno
  // se guarda en la constante creada por nosotros en el archivo "jwtConstants.secret"
  // JwtModule.register({
  //   global: true,  // que es una variable global y se podrá llamar en cualquier parte del proyecto
  //   secret: jwtConstants.secret,
  //   signOptions: {expiresIn:'1d'},  // '60s' segundos, '1d' un día
  //   }) // importo el módulo que quiero utilizar
  // ],  
  controllers: [AuthController],
  providers: [AuthService],
  exports:[JwtModule],
})
export class AuthModule {}
