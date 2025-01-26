import { PartialType } from '@nestjs/mapped-types';
import { CreateCatDto } from './create-cat.dto';

// PartialType, lo que hace es que extiende de DTO del CreateCatDto pero le pone a todos los campos opcionales
// tengo que instalar esta dependencia: yarn add @nestjs/mapped-types -SE
export class UpdateCatDto extends PartialType (CreateCatDto)  {

}

//export class UpdateCatDto  {
    // @IsString()
    // @MinLength(1)
    // @IsOptional()
    // name?: string;
    
    // @IsInt()
    // @IsPositive()
    // @IsOptional()
    // age?: number;
    
    // @IsString()
    // @IsOptional()
    //breed?: string;     // ? es para decir que este parámetro puede ser opcional
//}
