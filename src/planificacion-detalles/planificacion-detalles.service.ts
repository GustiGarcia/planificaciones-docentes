import { Injectable } from '@nestjs/common';
import { CreatePlanificacionDetalleDto } from './dto/create-planificacion-detalle.dto';
import { UpdatePlanificacionDetalleDto } from './dto/update-planificacion-detalle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanificacionDetalle } from 'src/entities/planificacion-detalle.entity';

@Injectable()
export class PlanificacionDetallesService {
  constructor(
    @InjectRepository(PlanificacionDetalle)
    private readonly detalleRepository: Repository<PlanificacionDetalle>,
  ) {}

  create(dto: CreatePlanificacionDetalleDto) {
    const {
      planificacionId,
      contenidoId,
      aprendizajesIds,
      estrategiaIds,
      actividadIds,
      metodoEvaluacionIds,
      temaIds,
    } = dto;

    const detalle = this.detalleRepository.create({
      planificacion: { id: planificacionId },
      contenidoCurricular: { id: contenidoId },
      ...(aprendizajesIds && {
        aprendizajes: aprendizajesIds.map((id) => ({ id })),
      }),
      ...(estrategiaIds && {
        estrategias: estrategiaIds.map((id) => ({ id })),
      }),
      ...(actividadIds && {
        actividades: actividadIds.map((id) => ({ id })),
      }),
      ...(metodoEvaluacionIds && {
        metodosEvaluacion: metodoEvaluacionIds.map((id) => ({ id })),
      }),
      ...(temaIds && {
        temas: temaIds.map((id) => ({ id })),
      }),
    });

    return this.detalleRepository.save(detalle);
  }
  findAll() {
    return `This action returns all planificacionDetalles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planificacionDetalle`;
  }

  update(
    id: number,
    updatePlanificacionDetalleDto: UpdatePlanificacionDetalleDto,
  ) {
    return `This action updates a #${id} planificacionDetalle`;
  }

  remove(id: number) {
    return `This action removes a #${id} planificacionDetalle`;
  }
}
