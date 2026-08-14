import {IsString, IsNotEmpty} from 'class-validator';

export class CreateMateriaDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
    @IsString()
    @IsNotEmpty()
    orientacion: string;}

    //validacion para que el nombre y la orientacion no esten vacios y sean de tipo string
    //DTO (Data Transfer Object) para crear una nueva materia, con las propiedades nombre y orientacion, ambas de tipo string y no vacias.es para validar los datos que se reciben en la peticion HTTP para crear una nueva materia.

    