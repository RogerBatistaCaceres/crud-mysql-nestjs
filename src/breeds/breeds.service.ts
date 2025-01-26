import { Injectable } from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Breed } from './entities/breed.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BreedsService {
  // Para poder insertar y manipular la base de datos, (trabajar con este patrón de diseño)
  // que es el Repository, por lo tanto en el constructor de la class BreedsService,
  // dentro de los parámetros del constructor tenemos que inyectar el 
  // Repositorio, e inicializamos una propiedad ReadOnly para que no se pueda 
  // manipular (mutar esa información), que lo podamos utilizar, pero no cambiar.
  
  // Básicamente la variable (propiedad) es breedRepository y le estamos diciendo 
  // que se tiene que comportar como un repositorio, y ese repositorio tiene
  // la entidad de Breed.  

  //Cuando se inyecta el repositorio se trabaja directamente con la base de datos
  constructor (
    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  ){}

  async create(createBreedDto: CreateBreedDto) {
    return await this.breedRepository.save(createBreedDto);
  }

  async findAll() {
    return await this.breedRepository.find();
  }

  async findOne(id: number) {
    return `This action returns a #${id} breed`;
  }

  async update(id: number, updateBreedDto: UpdateBreedDto) {
    return `This action updates a #${id} breed`;
  }

  async remove(id: number) {
    return `This action removes a #${id} breed`;
  }
}
