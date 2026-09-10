import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTemaDto } from './dto/create-tema.dto';
import { UpdateTemaDto } from './dto/update-tema.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tema } from 'src/entities/tema.entity';
@Injectable()
export class TemasService {
  constructor(
    @InjectRepository(Tema)
    private readonly temaRepository: Repository<Tema>,
  ) {}

  create(createTemaDto: CreateTemaDto) {
    const { userId, ...resto } = createTemaDto;
    const nuevoTema = this.temaRepository.create({
      ...resto,
      ...(userId && { user: { id: userId } }),
    });
    return this.temaRepository.save(nuevoTema);
  }

  findAll() {
    return this.temaRepository.find();
  }

  async findOne(id: number) {
    const tema = await this.temaRepository.findOneBy({ id });
    if (!tema) {
      throw new NotFoundException(`Tema con id ${id} no encontrada`);
    }
    return tema;
  }

  async update(id: number, updateTemaDto: UpdateTemaDto) {
    const { userId, ...resto } = updateTemaDto;
    const tema = await this.temaRepository.preload({
      id,
      ...resto,
      ...(userId && { user: { id: userId } }),
    });
    if (!tema) {
      throw new NotFoundException(`tema con id ${id} no encontrada`);
    }
    return this.temaRepository.save(tema);
  }

  async remove(id: number) {
    const tema = await this.temaRepository.findOneBy({ id });
    if (!tema) {
      throw new NotFoundException(`tema con id ${id} no encontrada`);
    }
    return this.temaRepository.remove(tema);
  }
}
