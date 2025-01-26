import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { Cat } from './entities/cat.entity';
// import { Breed } from 'src/breeds/entities/breed.entity';
import { BreedsModule } from '../breeds/breeds.module';
import { BreedsService } from '../breeds/breeds.service';
import { AuthModule } from '../auth/auth.module';

@Module({

  // solo con importar esta característica en el módulo, y tener el archivo
  // "cat.entity.ts" creado, ya me crea la tabla "cat" en la 
  // base de datos con la información del "cat.entity.ts"  

  // En esta opción el módulo CatsModule importa "BreedsModule" que a su
  // vez proporciona la entidad "Breed". Esto ayuda a mantener una mejor
  // separación de preocupaciones, ya que "CatsModule" no necesita conocer 
  // los detalles internos de la entidad "Breed". Si en un futuro se cambia 
  // la implementación de "BreedsModule", no afectaría directamente a "CatsModule".
  
  imports:[TypeOrmModule.forFeature([Cat]), BreedsModule, AuthModule],

  // En esta otra opción, el módulo "CatsModule" import directamente la entidad "Breed"
  // desde "src/breeds/entities/breed.entity", esto significa que el módulo
  // "CatsModule" tendrá acceso a la entidad "Breed" y podrá usarla es sus
  // controladores y servicios. Sin embargo, esta opción también introduce
  // una dependencia directa entre "CatsModule" y "Breed", lo que puede no
  // ser ideal si deseas mantener una arquitectura más modular y desacoplada.

  // imports:[TypeOrmModule.forFeature([Cat, Breed])],


  controllers: [CatsController],
  // providers: [CatsService],
  providers: [CatsService, BreedsService],
})
export class CatsModule {}
