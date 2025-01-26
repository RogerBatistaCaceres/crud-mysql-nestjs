import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('cats') // Utilizado por swagger (para documentar el API), para organizar por Tags
@ApiBearerAuth() // Para poder usar en swagger el token de autorización en las rutas protegidas
@ApiUnauthorizedResponse({description: 'Unauthorized Bearer Auth'}) // Utilizado en swagger para dar las respuestas de los códigos de errores de las solicitudes a las API
// verifica que a estas rutas solo entren los usuarios "user", verificando el JWTtoken y comparando 
// el role que viene encriptado en el JWTtoken, con el role que le pasamos en el decorador @Auth()
@Auth(Role.USER)   // Con este decorador personalizado le decimos a toda esta Ruta que todo lo que sea cat va a necesitar tener accesos de user
@Controller('cats')
export class CatsController {
  // Para poder utilizar el sevicio tenemos que inyectarlo,
  // entonces redefinimos el constructor para adicionar la propiedad
  // que nos permita acceder a los servicios
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiCreatedResponse({description: 'The record has been successfully created.'}) // Decoradores para indicar la respuesta a los códigos de errores desde Swagger
  @ApiForbiddenResponse({description: 'Forbidden.'}) // prohibido  // Decoradores para indicar la respuesta a los códigos de errores desde Swagger
  // A todas las peticiones debemos traer el decorador @ActiveUser() que hemos creado
  // porque en ese decorador viene la infomación del usuario y su role.
  // Ese decorador es el que nos trae y verifica el jWTtoken que viene del request.
  // Ese usuario, cada vez que se llame a este endpoint va a tener el email y el role, que viene desde el JWTtoken
  // y que lo recogemos y verificamos con el decorador @ActiveUser()
  create(@Body() createCatDto: CreateCatDto, @ActiveUser() user: UserActiveInterface) {
    return this.catsService.create(createCatDto, user);
  }

  @Get()
  findAll(@ActiveUser() user: UserActiveInterface) {
    return this.catsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @ActiveUser() user: UserActiveInterface) {
    return this.catsService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCatDto: UpdateCatDto, @ActiveUser() user: UserActiveInterface) {
    return this.catsService.update(id, updateCatDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @ActiveUser() user: UserActiveInterface) {
    return this.catsService.remove(id, user);
  }
}
