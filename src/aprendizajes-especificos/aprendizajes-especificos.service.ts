import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AprendizajeEspecifico } from 'src/entities/aprendizaje-especifico.entity';
import { CreateAprendizajeEspecificoDto } from './dto/create-aprendizajes-especificos.dto';
import { UpdateAprendizajeEspecificoDto } from './dto/update-aprendizajes-especificos.dto';
@Injectable()
export class AprendizajesEspecificosService {
  constructor(
    @InjectRepository(AprendizajeEspecifico)
    private readonly aprendizajeEspRepository: Repository<AprendizajeEspecifico>,
  ) {}

  findAll() {
    return this.aprendizajeEspRepository.find();
  }

  async findOne(id: number) {
    const aprendizajeEspecifico = await this.aprendizajeEspRepository.findOneBy(
      {
        id,
      },
    );
    if (!aprendizajeEspecifico) {
      throw new NotFoundException('aprendizajeEspecifico no encontrado');
    }
    return aprendizajeEspecifico;
  }

  create(createaprendizajeEspecificoDto: CreateAprendizajeEspecificoDto) {
    // Separamos "materiaId" del resto de propiedades del DTO.
    // "resto" queda con { anio, saberes } — todo menos materiaId.
    const { contenidoId, ...resto } = createaprendizajeEspecificoDto;

    // Armamos el objeto que espera la Entity:
    // - "...resto" desparrama anio y saberes tal cual
    // - "materia: { id: materiaId }" le dice a TypeORM
    //   "relacioná este contenido con la Materia que tiene ese id"
    //   (no hace falta traer la Materia completa, alcanza con el id)
    const nuevoaprendizajeEspecifico = this.aprendizajeEspRepository.create({
      ...resto,
      contenidoCurricular: { id: contenidoId },
    });

    // Recién acá se guarda de verdad en la base de datos (INSERT).
    return this.aprendizajeEspRepository.save(nuevoaprendizajeEspecifico);
  }
  async update(
    id: number,
    updateaprendizajeEspecificoDto: UpdateAprendizajeEspecificoDto,
  ) {
    const { contenidoId, ...resto } = updateaprendizajeEspecificoDto;
    const aprendizajeEspecifico = await this.aprendizajeEspRepository.preload({
      id,
      ...resto,
      ...(contenidoId && { contenidoCurricular: { id: contenidoId } }),
    });
    if (!aprendizajeEspecifico) {
      throw new NotFoundException(
        `aprendizajeEspecifico con id ${id} no encontrada`,
      );
    }
    return this.aprendizajeEspRepository.save(aprendizajeEspecifico);
  }

  async remove(id: number) {
    const aprendizajeEspecifico = await this.aprendizajeEspRepository.findOneBy(
      {
        id,
      },
    ); //busca la materia por id
    if (!aprendizajeEspecifico) {
      throw new NotFoundException(
        `aprendizajeEspecifico con id ${id} no encontrada`,
      );
    }
    return this.aprendizajeEspRepository.remove(aprendizajeEspecifico); //elimina la materia de la base de datos
  }
}
