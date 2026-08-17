import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateEjesDto {
  @IsOptional()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsNumber()
  materiaId: number;
}
