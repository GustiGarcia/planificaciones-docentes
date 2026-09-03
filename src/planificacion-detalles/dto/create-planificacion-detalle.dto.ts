import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanificacionDetalleDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 2, description: 'id de la planificacion' })
  planificacionId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'id del contenido' })
  contenidoId: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  @IsArray()
  @ApiProperty({ example: [4,5], description: 'id de los aprendizajes' })
  aprendizajesIds?: number[];

  @IsNumber({}, { each: true })
  @IsOptional()
  @IsArray()
  @ApiProperty({ example: [1,3], description: 'ids de las estrategias' })
  estrategiaIds?: number[];

  @IsNumber({}, { each: true })
  @IsOptional()
  @IsArray()
  @ApiProperty({ example: [4,5], description: 'id de las actividades' })
  actividadIds?: number[];

  @IsNumber({},{each:true})
  @IsOptional()
  @IsArray()
  @ApiProperty({example:[7,1],description:'id de los metodos de evaluacion'})
  metodoEvaluacionIds?:number[];

  @IsNumber({},{each:true})
  @IsOptional()
  @IsArray()
  @ApiProperty({example:[1,2],description:'id de los temas'})
  temaIds?:number[];


}
