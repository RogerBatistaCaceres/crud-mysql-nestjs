import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from '../breeds/entities/breed.entity';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from '../common/enums/rol.enum';

@Injectable()
export class CatsService {
  // Para poder insertar y manipular la base de datos, (trabajar con este patrón de diseño)
  // que es el Repository, por lo tanto en el constructor de la class CatsService,
  // dentro de los parámetros del constructor tenemos que inyectar el 
  // Repositorio, e inicializamos una propiedad ReadOnly para que no se pueda 
  // manipular (mutar esa información), que lo podamos utilizar, pero no cambiar.
  
  // Básicamente la variable (propiedad) es catRepository y le estamos diciendo 
  // que se tiene que comportar como un repositorio, y ese repositorio tiene
  // la entidad de Cat.  

  //Cuando se inyecta el repositorio se trabaja directamente con la base de datos
  constructor (
   @InjectRepository(Cat)
   private readonly catRepository: Repository<Cat>,
   @InjectRepository(Breed)
   private readonly breedRepository: Repository<Breed>
  ){}

  async create(createCatDto: CreateCatDto, user: UserActiveInterface) {
    const breed = await this.validateBreed(createCatDto.breed);
//    const cat = this.catRepository.create({
//      name: createCatDto.name,
//      age: createCatDto.age,
//      breed,
//    });
//    return await this.catRepository.save(cat);
    return await this.catRepository.save({
      ...createCatDto,   // tenemos que hacer la copia y pasarle el breed
      // aca le paso la instancia "breed" porque es lo que me pide TypORM
      // aunque realmente en la base de datos el guarde internamente breed.id
      // no se le puede pasar el breed.id, porque lo que pide TypORM es que se le pase
      // la instancia. El motor TypORM se engarga de guardar realmente el id.
      // Así es como trabaja TypORM
      breed: breed,
      userEmail: user.email,

    });
  }

  async findAll(user: UserActiveInterface) {
    if(user.role === Role.ADMIN) {
      // devuelvo todos los gatos ..
      return await this.catRepository.find();
    }
    return await this.catRepository.find({
      // devuelvo solo los gatos que cumplan con esa condicion.
      where: { userEmail: user.email },
    });
  }

  async findOne(id: number, user: UserActiveInterface) {
    const cat = await this.catRepository.findOneBy({ id });
    if (!cat) {
      throw new BadRequestException ('Cat not found');
    }
    this.validateownership(cat, user)
    // si todo se cumple y llega aca, entonces retorna el contenido de cat
    return cat;
  }

  async update(id: number, updateCatDto: UpdateCatDto, user: UserActiveInterface) {
    // return await this.catRepository.update(id, updateCatDto);
    await this.findOne(id,user);
    return await this.catRepository.update(id, {
      ...updateCatDto,    // le paso una copia de updateCatDto
      // Si existe updateCatDto.breed entonces Valida el breed "validateBreed" pero si no existe lo manda como
      // indefinido y entonces no lo actualiza. Al enviar undefined ignora ese campo.
      breed: updateCatDto.breed ? await this.validateBreed(updateCatDto.breed) : undefined,
      userEmail: user.email,
    })
  }

  async remove(id: number, user: UserActiveInterface) {
    // softDelete va a la base de datos y le pone una fecha a la propiedad "deletedAt"
    // pero no elimina el elemento.
    await this.findOne(id, user);
    return await this.catRepository.softDelete(id);
  }

  // Me creo este metodo para validar el role del usuario y el email del usuario
  private validateownership(cat: Cat, user: UserActiveInterface) {
    if (user.role !== Role.ADMIN && cat.userEmail !== user.email){
      throw new UnauthorizedException()
   }
  }

  private async validateBreed(breed: string) {
    const breedEntity = await this.breedRepository.findOneBy({name: breed});
    if (!breedEntity){
      throw new  BadRequestException('Breed not found');
   }
   return breedEntity;
  }
}
