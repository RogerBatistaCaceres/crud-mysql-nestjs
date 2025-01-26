import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('breeds') // Utilizado por swagger (para documentar el API), para organizar por Tags
@ApiBearerAuth() // Para poder usar en swagger el token de autorización en las rutas protegidas
// verifica que a estas rutas solo entren los usuarios "admin", verificando el JWTtoken y comparando 
// el role que viene encriptado en el JWTtoken, con el role que le pasamos en el decorador @Auth()
@Auth(Role.ADMIN)   // Con este decorador personalizado le decimos a toda esta Ruta que todo lo que sea breed va a necesitar tener accesos de admin
@Controller('breeds')
export class BreedsController {
  // Para poder utilizar el sevicio tenemos que inyectarlo,
  // entonces redefinimos el constructor para adicionar la propiedad
  // que nos permita acceder a los servicios
  constructor(private readonly breedsService: BreedsService) {}

  @Post()
  create(@Body() createBreedDto: CreateBreedDto) {
    return this.breedsService.create(createBreedDto);
  }

  @Get()
  findAll() {
    return this.breedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.breedsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBreedDto: UpdateBreedDto) {
    return this.breedsService.update(id, updateBreedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.breedsService.remove(id);
  }
}
