import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber } from "class-validator";

export class CreateMetodosEvaluacionDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsBoolean()
  @IsOptional()
  esPredefinida?: boolean;

  @IsNumber()
  @IsOptional()
  userId?: number;
}
