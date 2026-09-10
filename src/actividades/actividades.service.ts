import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActividadeDto } from './dto/create-actividade.dto';
import { UpdateActividadeDto } from './dto/update-actividade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Actividad } from 'src/entities/actividad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
  ) {}

  create(createActividadeDto: CreateActividadeDto) {
    const { userId, ...resto } = createActividadeDto;
    const nuevaActvidad = this.actividadRepository.create({
      ...resto,
      ...(userId && { user: { id: userId } }),
    });
    return this.actividadRepository.save(nuevaActvidad);
  }

  findAll() {
    return this.actividadRepository.find();
  }

  async findOne(id: number) {
    const actividad = await this.actividadRepository.findOneBy({ id });
    if (!actividad) {
      throw new NotFoundException(`Actividad con id ${id} no encontrada`);
    }
    return actividad;
  }

  async update(id: number, updateActividadeDto: UpdateActividadeDto) {
    const { userId, ...resto } = updateActividadeDto;
    const actividad = await this.actividadRepository.preload({
      id,
      ...resto,
      ...(userId && { user: { id: userId } }),
    });
    if (!actividad) {
      throw new NotFoundException(`Actividad con id ${id} no encontrada`);
    }
    return this.actividadRepository.save(actividad);
  }

  async remove(id: number) {
    const actividad = await this.actividadRepository.findOneBy({ id });
    if (!actividad) {
      throw new NotFoundException(`Actividad con id ${id} no encontrada`);
    }
    return this.actividadRepository.remove(actividad);
  }
}
