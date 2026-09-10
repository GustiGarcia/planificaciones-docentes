import { IsString, IsNotEmpty, IsEmail, IsOptional } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  rol?: string;
}
