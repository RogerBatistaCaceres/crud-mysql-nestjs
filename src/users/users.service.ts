import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  // Para poder insertar y manipular la base de datos, (trabajar con este patrón de diseño)
  // que es el Repository, por lo tanto en el constructor de la class UsersService,
  // dentro de los parámetros del constructor tenemos que inyectar el 
  // Repositorio, e inicializamos una propiedad ReadOnly para que no se pueda 
  // manipular (mutar esa información), que lo podamos utilizar, pero no cambiar.
  
  // Básicamente la variable (propiedad) es userRepository y le estamos diciendo 
  // que se tiene que comportar como un repositorio, y ese repositorio tiene
  // la entidad de User.  

  //Cuando se inyecta el repositorio se trabaja directamente con la base de datos
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

   findOnebyEmail(email: string){ 
     return this.userRepository.findOneBy({email})
   }

   findOnebyEmailWithPassword(email: string){ 
    // esto es una busqueda en la base de datos, pero personalizada..
    // encuentra cuando el email coincida y traeme el id, name, email, password
    return this.userRepository.findOne({
      where: {email},
      select: ['id','name','email','password','role'],
      })
  }

   findAll() {
      return this.userRepository.find();
    }

    findOne(id: number) {
      return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
      return `This action updates a #${id} user`;
    }

    remove(id: number) {
      return `This action removes a #${id} user`;
    }
}
