import { CreateMetodosEvaluacionDto } from './dto/create-metodos-evaluacion.dto';
import { UpdateMetodosEvaluacionDto } from './dto/update-metodos-evaluacion.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoEvaluacion } from 'src/entities/metodo-evaluacion.entity';

@Injectable()
export class MetodosEvaluacionService {
  constructor(
    @InjectRepository(MetodoEvaluacion)
    private readonly metodoEvaluacionRepository: Repository<MetodoEvaluacion>,
  ) {}

  create(createMetodosEvaluacionDto: CreateMetodosEvaluacionDto) {
    const { userId, ...resto } = createMetodosEvaluacionDto;
    const nuevoMetodo = this.metodoEvaluacionRepository.create({
      ...resto,
      ...(userId && { user: { id: userId } }),
    });
    return this.metodoEvaluacionRepository.save(nuevoMetodo);
  }

  findAll() {
    return this.metodoEvaluacionRepository.find();
  }

  async findOne(id: number) {
    const metodo = await this.metodoEvaluacionRepository.findOneBy({ id });
    if (!metodo) {
      throw new NotFoundException(`Metodo Evaluacion con id ${id} no encontrada`);
    }
    return metodo;
  }

  async update(id: number, updateMetodosEvaluacionDto: UpdateMetodosEvaluacionDto) {
    const { userId, ...resto } = updateMetodosEvaluacionDto;
    const metodo = await this.metodoEvaluacionRepository.preload({
      id,
      ...resto,
      ...(userId && { user: { id: userId } }),
    });
    if (!metodo) {
      throw new NotFoundException(`Metodo Evaluacion con id ${id} no encontrada`);
    }
    return this.metodoEvaluacionRepository.save(metodo);
  }

  async remove(id: number) {
    const metodo = await this.metodoEvaluacionRepository.findOneBy({ id });
    if (!metodo) {
      throw new NotFoundException(`Metodo Evaluacion con id ${id} no encontrada`);
    }
    return this.metodoEvaluacionRepository.remove(metodo);
  }
}
