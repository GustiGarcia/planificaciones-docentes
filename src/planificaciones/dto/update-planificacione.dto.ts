import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanificacioneDto } from './create-planificacione.dto';

export class UpdatePlanificacioneDto extends PartialType(CreatePlanificacioneDto) {}
