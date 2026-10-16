/* ═══════════════════════════════════════════════════════════════
   DocumentoPlanificacionDto
   La planificación ya resuelta, lista para convertir en Word.

   Acá NO hay ids: hay textos. Es la diferencia con los otros DTOs
   del proyecto, y es a propósito.

   ¿Por qué? Porque el Word se genera en dos situaciones distintas:

     1. Desde una planificación guardada → el backend la busca en la
        base y la traduce a esta forma.
     2. Desde el armado en pantalla, SIN guardar → el front ya tiene
        todos los textos a la vista (es lo que muestra el canvas) y
        los manda tal cual.

   Si el DTO pidiera ids, el caso 2 obligaría al backend a ir a
   buscar a la base siete tipos de entidad distintos para rearmar
   algo que el front ya tenía resuelto. Con esta forma, el service
   de Word no sabe nada de TypeORM: recibe textos y da formato. Una
   sola responsabilidad.
   ═══════════════════════════════════════════════════════════════ */

import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Una fila de la tabla, con todo su contenido en texto. */
export class FilaDocumentoDto {
  @IsString()
  @ApiProperty({ example: 'Prácticas corporales expresivas…' })
  saberes: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], example: ['Reconoce sus posibilidades…'] })
  aprendizajes: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], example: ['Trabajo en estaciones'] })
  estrategias: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], example: ['Circuito de habilidades'] })
  actividades: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], example: ['Observación con rúbrica'] })
  evaluacion: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], example: ['Vida saludable'] })
  abp: string[];
}

export class DocumentoPlanificacionDto {
  @IsString()
  @ApiProperty({ example: '3° 2da' })
  cursoDivision: string;

  @IsInt()
  @ApiProperty({ example: 2026 })
  anioLectivo: number;

  @IsString()
  @ApiProperty({ example: 'Educación Física' })
  materia: string;

  @IsString()
  @ApiProperty({ example: 'Gustavo García' })
  docente: string;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({
    example: 1,
    description: 'Omitir o null para planificación anual',
  })
  cuatrimestre?: number | null;

  /* @ValidateNested + @Type son necesarios para que class-validator
     entre a revisar los objetos de adentro del array. Sin ellos,
     valida que "filas" sea un array y se detiene ahí: podrías mandar
     [{ cualquier: 'cosa' }] y pasaría. @Type le dice a
     class-transformer en qué clase convertir cada elemento, porque
     el JSON que llega no trae esa información. */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilaDocumentoDto)
  @ApiProperty({ type: [FilaDocumentoDto] })
  filas: FilaDocumentoDto[];
}
