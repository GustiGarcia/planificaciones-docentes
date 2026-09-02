import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMetodosEvaluacionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:'Listas de control', description:'metodo de evaluacion a crear'})
  nombre: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({example:false,description:'es predefinida el metodo o no', required:true})
  esPredefinida?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({example:2,description:'id del user que crea la evaluacion'})
  userId?: number;
}
