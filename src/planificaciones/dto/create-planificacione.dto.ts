import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePlanificacioneDto {
    @IsString()
    @IsNotEmpty()
    cursoDivision:string;

    @IsNumber()
    anioLectivo:number;

    @IsNumber()
    userId:number

    @IsNumber()
    materiaId:number;
}
