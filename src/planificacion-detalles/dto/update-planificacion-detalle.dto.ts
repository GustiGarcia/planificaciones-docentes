import { PartialType } from '@nestjs/swagger';
import { CreatePlanificacionDetalleDto } from './create-planificacion-detalle.dto';

export class UpdatePlanificacionDetalleDto extends PartialType(CreatePlanificacionDetalleDto) {}
