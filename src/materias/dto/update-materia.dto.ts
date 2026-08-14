import {IsString, IsOptional} from 'class-validator';

export class UpdateMateriaDto {
    @IsString()
    @IsOptional()
    nombre: string;
    @IsString()
    @IsOptional()
    orientacion: string;}

    //validacion para que el nombre y la orientacion no esten vacios y sean de tipo string
    //DTO (Data Transfer Object) para crear una nueva materia, con las propiedades nombre y orientacion, ambas de tipo string y no vacias.es para validar los datos que se reciben en la peticion HTTP para crear una nueva materia.

    