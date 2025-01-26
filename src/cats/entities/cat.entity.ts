import { User } from "../../users/entities/user.entity";
import { Breed } from "../../breeds/entities/breed.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Cat {
    //@PrimaryGeneratedColumn()
    @Column({primary: true, generated: true})
    id: number;

    @Column({length: 500})
    name: string;

    @Column()
    age: number;

  // Pueden haber muchos "cats" con una misma raza "breed"  ManyToOne... Many "cats" to One "breed".
  // Relaciona la tabla de cats con una raza "breed"
  // Importante: La regla de Oro, es que el OneToMany no puede vivir sin un ManytoOne..
  // Pero un ManyToOne no necesariamente necesita de un OneToMany.  
  // Esto es así porque el ManytoOne es el que hace físicamente el campo en la base de datos 
  @ManyToOne(()=> Breed,(breed)=>breed.id, {
      eager : true,  // para que traiga las raza al hacer un findOne
    })
    breed: Breed;
 
    // Pueden haber muchos "cats" con un mismo usuario "user"  ManyToOne... Many "cats" to One "user".
    // Relaciona la tabla de cats con un usuario
    @ManyToOne(() => User)
    // Este decorador lo que hace es que le dice que el campo que se va a a relacionar en 
    // la base de datos para almacenar el usuario se va a llamar "userEmail", 
    // y la referencia o forenge key  va a ser el email de la base de datos User
    // por eso es que tengo que crear en la base de datos la columna "userEmail"
    // este decorador no la crea, solo la "ASOCIA".
    
    // La idea diferente a Breed es que yo no quiero almacenar el id del usuario
    // yo solo quiero guardar el email (que viene en en JWT) cuando se crea un cat
    // lo lo hago de la forma de los Breed entonces se guardaría el user_id y no el email..
    // explicación en el minuto 51:00:
    // https://www.youtube.com/watch?v=D6_dhpzPOvU&list=PLPl81lqbj-4LqA6sXRETXUg4uNkYG4aUc&index=5

    @JoinColumn({name: 'userEmail', referencedColumnName: 'email',})
    user: User;    
    
    @Column()
    userEmail: string;

    @DeleteDateColumn()
    deletedAt: Date;    
}
