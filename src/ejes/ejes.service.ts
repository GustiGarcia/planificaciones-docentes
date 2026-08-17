import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Eje } from 'src/entities/eje.entity';
import { CreateEjesDto } from './dto/create-ejes.dto';
import { UpdateEjesDto } from './dto/update-ejes.dto';
import { NumericType } from 'typeorm/driver/mongodb/typings.js';

@Injectable()
export class EjesService {
  constructor(
    @InjectRepository(Eje) private readonly ejeRepository: Repository<Eje>,
  ) {}

  findAll() {
    return this.ejeRepository.find();
  }

  async findOne(id: number) {
    const eje = await this.ejeRepository.findOneBy({
      id,
    });
    if (!eje) {
      throw new NotFoundException('eje no encontrado');
    }
    return eje;
  }

  create(createEjeDto: CreateEjesDto) {
    // Separamos "materiaId" del resto de propiedades del DTO.
    // "resto" queda con { anio, saberes } — todo menos materiaId.
    const { materiaId, ...resto } = createEjeDto;

    // Armamos el objeto que espera la Entity:
    // - "...resto" desparrama anio y saberes tal cual
    // - "materia: { id: materiaId }" le dice a TypeORM
    //   "relacioná este contenido con la Materia que tiene ese id"
    //   (no hace falta traer la Materia completa, alcanza con el id)
    const nuevoEje = this.ejeRepository.create({
      ...resto,
      materia: { id: materiaId },
    });

    // Recién acá se guarda de verdad en la base de datos (INSERT).
    return this.ejeRepository.save(nuevoEje);
  }
  async update(
    id: number,
    updateEjeDto: UpdateEjesDto,
  ) {
    const eje = await this.ejeRepository.preload({
      id,
      ...updateEjeDto,
    }); //preload busca la materia por id y actualiza los datos con los del dto
    if (!eje) {
      throw new NotFoundException(`Eje con id ${id} no encontrada`);
    }
    return this.ejeRepository.save(eje); //guarda la materia actualizada en la base de datos
  }

  async remove(id: number) {
    const eje = await this.ejeRepository.findOneBy({
      id,
    }); //busca la materia por id
    if (!eje) {
      throw new NotFoundException(`Eje con id ${id} no encontrada`);
    }
    return this.ejeRepository.remove(eje); //elimina la materia de la base de datos
  }
}
