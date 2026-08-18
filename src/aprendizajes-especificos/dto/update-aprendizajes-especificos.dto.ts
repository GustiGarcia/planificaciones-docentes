import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAprendizajeEspecificoDto {
  @IsOptional()
  @IsString()
  descripcion: string;

  @IsOptional()
  @IsNumber()
  contenidoId: number;
}
