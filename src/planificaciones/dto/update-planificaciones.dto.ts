import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanificacionesDto } from './create-planificaciones.dto';
export class UpdatePlanificacionesDto extends PartialType(CreatePlanificacionesDto) {}
