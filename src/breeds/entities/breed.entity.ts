import { Cat } from "../../cats/entities/cat.entity";
import { Column, DeleteDateColumn, Entity, OneToMany } from "typeorm";

@Entity()
export class Breed {
  //@PrimaryGeneratedColumn()
  @Column({primary: true, generated: true})    
  id: number

  @Column({unique: true})
  name: string

  // Importante: La regla de Oro, es que el OneToMany no puede vivir sin un ManytoOne..
  // Pero un ManyToOne no necesariamente necesita de un OneToMany.  
  // Esto es así porque el ManytoOne es el que hace físicamente el campo en la base de datos 
  @OneToMany(()=> Cat, (cat)=> cat.breed)
  cats: Cat[];

  @DeleteDateColumn()
  deletedAt: Date;
}

