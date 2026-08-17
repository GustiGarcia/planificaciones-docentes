import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEjesDto{
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsNumber()
    @IsNotEmpty()
    materiaId: number;

}