import {IsString, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMateriaDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'Educacion Fisica', description:'Nombre de la materia segun DCP'})
    nombre: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'Turismo', description:'Nombre de la orientacion de la escuela'})
    orientacion: string;}

//validacion para que el nombre y la orientacion no esten vacios y sean de tipo string
//DTO (Data Transfer Object) para crear una nueva materia, con las propiedades nombre y orientacion, ambas de tipo string y no vacias.es para validar los datos que se reciben en la peticion HTTP para crear una nueva materia.
