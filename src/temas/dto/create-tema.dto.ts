import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:'Resistencia y velocidad',description:'Temas materias'})
  nombre: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({example:true,description:'Es predefinida o no', required:true})
  esPredefinida?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({example:1,description:'id usuario'})
  userId?: number;
}
