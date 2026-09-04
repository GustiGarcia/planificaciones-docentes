import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreatePlanificacionesDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'2do 4ta',description:'curso y division'})
    cursoDivision:string;

    @IsNumber()
    @ApiProperty({example:2026,description:'anio lectivo de la planificacion'})
    anioLectivo:number;

    @IsNumber()
    @ApiProperty({example:1,description:'id del usuario'})
    userId:number

    @IsNumber()
    @ApiProperty({example:2,description:'id de la materia'})
    materiaId:number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({example:2,description:'Cuatrimestre 1 o 2/ el null da planificacion Anual'})
    cuatrimestre?:number;
}
