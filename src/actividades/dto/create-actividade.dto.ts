import { ApiProperty, ApiParam } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateActividadeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Rondas y Rondines',
    description: 'descripcion de las actividades a utilizar',
  })
  nombre: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: false,
    description: 'indica sila estrategia es predefinida o no',
    required: false,
  })
  esPredefinida?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: '3', description: 'id del usuario', required: false })
  userId?: number;
}
