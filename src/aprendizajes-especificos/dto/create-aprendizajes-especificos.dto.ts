import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAprendizajeEspecificoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'saber realizar juegos de rondas, diferenciación y equilibrio enrelación a objetivos motores',
    description: 'Aprendizaje especifico dcp de la materia',
  })
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 3, description: 'id del contenido', required: true })
  contenidoId: number;
}
