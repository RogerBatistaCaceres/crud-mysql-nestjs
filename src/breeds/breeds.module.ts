import { Module } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { BreedsController } from './breeds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breed } from './entities/breed.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  // solo con importar esta característica en el módulo, y tener el archivo
  // "breed.entity.ts" creado, ya me crea la tabla "breed" en la 
  // base de datos con la información del "breed.entity.ts"  
  imports: [TypeOrmModule.forFeature([Breed]), AuthModule],
  controllers: [BreedsController],
  providers: [BreedsService],
  exports: [TypeOrmModule],
})
export class BreedsModule {}
