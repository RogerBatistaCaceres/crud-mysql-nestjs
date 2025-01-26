import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // solo con importar esta característica en el módulo, y tener el archivo
    // "user.entity.ts" creado, ya me crea la tabla "user" en la 
    // base de datos con la información del "user.entity.ts"  

    // solo con importar esta caracteristica en el módulo, y tener el archivo
    // "user.entity.ts" creado, ya me crea la tabla en la 
    // base de datos con la información del "user.entity.ts"
    TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule) ],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService], // esto es lo que yo quiero que otro módulo lo utilice
})
export class UsersModule {}
