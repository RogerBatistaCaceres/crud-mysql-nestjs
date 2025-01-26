import { Role } from "../../common/enums/rol.enum";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

//@Column({primary: true, generated: true})
@PrimaryGeneratedColumn()
id: number;

@Column()
name: string;

@Column({unique: true, nullable: false}) // no puede estar este campo vacio
email: string;

@Column({nullable: false, select: false})  // select: false, ya no nos va a devolver la password cuando devolvemos el usuario cuando hacemos un find a la base de datos
password: string;


@Column({ type:'enum', default: Role.USER, enum: Role})  // cuando se cree un nuevo usuario que por defecto sea 'user', también puedo decir que esta columna sea de tipo enum.. y yo especificar los datos..
role: Role;

@DeleteDateColumn()
deletedAt: Date;


}
