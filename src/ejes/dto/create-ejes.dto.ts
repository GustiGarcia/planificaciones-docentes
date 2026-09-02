import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEjesDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'Disponibilidad con el y con los demas',description:'nombre del eje'})
    nombre: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({example:7,description:'Id de la materia'})
    materiaId: number;

}