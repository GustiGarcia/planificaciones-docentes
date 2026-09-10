import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEstrategiasEnsenanzaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:'Mando Directo', description:'Nombre de la estrategia de enseñanza'})
  nombre: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({example:true,description:'Es definida o no', required:true})
  esPredefinida?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({example:3,description:'Id del user que la crea'})
  userId?: number;
}
