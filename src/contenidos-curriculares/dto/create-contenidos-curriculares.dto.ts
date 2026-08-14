import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateContenidosCurricularesDto {
  @IsString()
  @IsNotEmpty()
  anio: string;
  @IsNotEmpty()
  @IsString()
  saberes: string;
  @IsNotEmpty()
  @IsNumber()
  materiaId: number;
}
