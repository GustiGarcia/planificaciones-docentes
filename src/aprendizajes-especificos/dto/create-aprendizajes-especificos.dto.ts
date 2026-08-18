import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAprendizajeEspecificoDto{
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsNumber()
    @IsNotEmpty()
    contenidoId: number;

}