import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/rol.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users') // Utilizado por swagger (para documentar el API), para organizar por Tags
@ApiBearerAuth() // Para poder usar en swagger el token de autorización en las rutas protegidas
// verifica que a estas rutas solo entren los usuarios "admin", verificando el JWTtoken y comparando 
// el role que viene encriptado en el JWTtoken, con el role que le pasamos en el decorador @Auth()
@Auth(Role.ADMIN) // Con este decorador personalizado le decimos a toda esta Ruta que todo lo que sea user va a necesitar tener accesos de admin
@Controller('users')
export class UsersController {
  // Para poder utilizar el sevicio tenemos que inyectarlo,
  // entonces redefinimos el constructor para adicionar la propiedad
  // que nos permita acceder a los servicios
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
