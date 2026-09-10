import { CreateEstrategiasEnsenanzaDto } from './dto/create-estrategias-ensenanza.dto';
import { UpdateEstrategiasEnsenanzaDto } from './dto/update-estrategias-ensenanza.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstrategiaEnsenanza } from 'src/entities/estrategia-ensenanza.entity';

@Injectable()
export class EstrategiasEnsenanzaService {
  constructor(
    @InjectRepository(EstrategiaEnsenanza)
    private readonly estrategiasEnsenanzaRepository: Repository<EstrategiaEnsenanza>,
  ) {}

  create(createEstrategiasEnsenanzaDto: CreateEstrategiasEnsenanzaDto) {
    const { userId, ...resto } = createEstrategiasEnsenanzaDto;
    const nuevaEstrategia = this.estrategiasEnsenanzaRepository.create({
      ...resto,
      ...(userId && { user: { id: userId } }),
    });
    return this.estrategiasEnsenanzaRepository.save(nuevaEstrategia);
  }

  findAll() {
    return this.estrategiasEnsenanzaRepository.find();
  }

  async findOne(id: number) {
    const estrategia = await this.estrategiasEnsenanzaRepository.findOneBy({ id });
    if (!estrategia) {
      throw new NotFoundException(`Estrategia Evaluacion con id ${id} no encontrada`);
    }
    return estrategia;
  }

  async update(id: number, updateEstrategiasEnsenanzaDto: UpdateEstrategiasEnsenanzaDto) {
    const { userId, ...resto } = updateEstrategiasEnsenanzaDto;
    const estrategia = await this.estrategiasEnsenanzaRepository.preload({
      id,
      ...resto,
      ...(userId && { user: { id: userId } }),
    });
    if (!estrategia) {
      throw new NotFoundException(`Estrategia Evaluacion con id ${id} no encontrada`);
    }
    return this.estrategiasEnsenanzaRepository.save(estrategia);
  }

  async remove(id: number) {
    const estrategia = await this.estrategiasEnsenanzaRepository.findOneBy({ id });
    if (!estrategia) {
      throw new NotFoundException(`Estrategia Evaluacion con id ${id} no encontrada`);
    }
    return this.estrategiasEnsenanzaRepository.remove(estrategia);
  }
}
