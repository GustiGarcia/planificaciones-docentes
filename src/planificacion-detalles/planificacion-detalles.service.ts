import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    const detalle = await this.detalleRepository.findOne({
      where: { id },
      relations: {
        planificacion: true,
        contenidoCurricular: true,
        aprendizajes: true,
        estrategias: true,
        actividades: true,
        metodosEvaluacion: true,
        temas: true,
      },
    });
    if (!detalle) {
      throw new NotFoundException(`Detalle con id ${id} no encontrado`);
    }
    return detalle;
  }

  async update(id: number, dto: UpdatePlanificacionDetalleDto) {
    const {
      planificacionId,
      contenidoId,
      aprendizajesIds,
      estrategiaIds,
      actividadIds,
      metodoEvaluacionIds,
      temaIds,
    } = dto;

    const detalle = await this.detalleRepository.preload({
      id,
      ...(planificacionId && { planificacion: { id: planificacionId } }),
      ...(contenidoId && { contenidoCurricular: { id: contenidoId } }),
      ...(aprendizajesIds && {
        aprendizajes: aprendizajesIds.map((id) => ({ id })),
      }),
      ...(estrategiaIds && {
        estrategias: estrategiaIds.map((id) => ({ id })),
      }),
      ...(actividadIds && { actividades: actividadIds.map((id) => ({ id })) }),
      ...(metodoEvaluacionIds && {
        metodosEvaluacion: metodoEvaluacionIds.map((id) => ({ id })),
      }),
      ...(temaIds && { temas: temaIds.map((id) => ({ id })) }),
    });

    if (!detalle) {
      throw new NotFoundException(`Detalle con id ${id} no encontrado`);
    }
    return this.detalleRepository.save(detalle);
  }

  async remove(id: number) {
    const detalle = await this.detalleRepository.findOneBy({ id });
    if (!detalle) {
      throw new NotFoundException(`Detalle con id ${id} no encontrado`);
    }
    return this.detalleRepository.remove(detalle);
  }
}
