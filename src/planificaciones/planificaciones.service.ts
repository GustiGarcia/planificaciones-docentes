import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanificacionesDto } from './dto/create-planificaciones.dto';
import { UpdatePlanificacionesDto } from './dto/update-planificaciones.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planificacion } from 'src/entities/planificacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanificacionesService {
  constructor(
    @InjectRepository(Planificacion)
    private readonly planificacionRepository: Repository<Planificacion>,
  ) {}

  create(createPlanificacioneDto: CreatePlanificacionesDto) {
    const { userId, materiaId, ...resto } = createPlanificacioneDto;
    const nueva = this.planificacionRepository.create({
      ...resto,
      user: { id: userId },
      materia: { id: materiaId },
    });
    return this.planificacionRepository.save(nueva);
  }

  findAll() {
    return this.planificacionRepository.find({
      relations: {user:true, materia:true},
    });
  }

  async findOne(id: number) {
    const planificacion = await this.planificacionRepository.findOne({
      where: { id },
      relations: {user:true, materia:true},
    });
    if (!planificacion) {
      throw new NotFoundException(`Planificacion con id ${id} no encontrada`);
    }
    return planificacion;
  }

  async update(id: number, updatePlanificacioneDto: UpdatePlanificacionesDto) {
    const { userId, materiaId, ...resto } = updatePlanificacioneDto;
    const planificacion = await this.planificacionRepository.preload({
      id,
      ...resto,
      ...(userId && { user: { id: userId } }),
      ...(materiaId && { materia: { id: materiaId } }),
    });
    if (!planificacion) {
      throw new NotFoundException(`planificacion con id ${id} no encontrada`);
    }
    return this.planificacionRepository.save(planificacion);
  }

  async remove(id: number) {
    const planificacion = await this.planificacionRepository.findOneBy({ id });
    if (!planificacion) {
      throw new NotFoundException(`planificacion con id ${id} no encontrada`);
    }
    return this.planificacionRepository.remove(planificacion);
  }
}
