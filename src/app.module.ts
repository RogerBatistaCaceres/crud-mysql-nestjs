import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreedsModule } from './breeds/breeds.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({     // para poder el archivo de configuración .env
      isGlobal: true,
    }),
  TypeOrmModule.forRoot({
    type: "mysql",
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT), 
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      autoLoadEntities: true,  // carga todas las entidades, por eso es que pongo en comentario la linea de las entidades
      //entities:[],
      synchronize: true,
  }),
  CatsModule,
  BreedsModule,
  UsersModule,
  AuthModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}
