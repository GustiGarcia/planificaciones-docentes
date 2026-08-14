import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateContenidosCurricularesDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  anio: string;
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  saberes: string;
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  materiaId: number;
}
