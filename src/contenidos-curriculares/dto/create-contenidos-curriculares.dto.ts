import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContenidosCurricularesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 2022, description: 'anio de la planificacion' })
  anio: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example:
      'Identificar y valorar los propios cambios corporales y posibilidades de movimiento, precisión y expresiónen prácticas corporales variadas y combinadas.', description:'saber curricular',
  })
  saberes: string;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({example:1,description:'Id del eje donde va el saber'})
  ejeId: number;
}
