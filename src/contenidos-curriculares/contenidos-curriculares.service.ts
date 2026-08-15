import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContenidoCurricular } from '../entities/contenido-curricular.entity';
import { CreateContenidosCurricularesDto } from './dto/create-contenidos-curriculares.dto';

@Injectable()
export class ContenidosCurricularesService {
  constructor(
    @InjectRepository(ContenidoCurricular)
    private readonly contenidoCurricularRepository: Repository<ContenidoCurricular>,
  ) {}

  findAll() {
    return this.contenidoCurricularRepository.find();
  }

  async findOne(id: number) {
    const contenido = await this.contenidoCurricularRepository.findOneBy({
      id,
    });
    if (!contenido) {
      throw new NotFoundException('Contenido no encontrado');
    }
    return contenido;
  }
  create(createContenidoDto: CreateContenidosCurricularesDto) {
    // Separamos "materiaId" del resto de propiedades del DTO.
    // "resto" queda con { anio, saberes } — todo menos materiaId.
    const { ejeId, ...resto } = createContenidoDto;
  
    // Armamos el objeto que espera la Entity:
    // - "...resto" desparrama anio y saberes tal cual
    // - "materia: { id: materiaId }" le dice a TypeORM
    //   "relacioná este contenido con la Materia que tiene ese id"
    //   (no hace falta traer la Materia completa, alcanza con el id)
    const nuevoContenido = this.contenidoCurricularRepository.create({
      ...resto,
      eje: { id: ejeId },
    });
  
    // Recién acá se guarda de verdad en la base de datos (INSERT).
    return this.contenidoCurricularRepository.save(nuevoContenido);
  }
  async update(id: number, updateContenidoDto: CreateContenidosCurricularesDto) {
    const contenido = await this.contenidoCurricularRepository.preload({
      id,
      ...updateContenidoDto,
    }); //preload busca la materia por id y actualiza los datos con los del dto
    if (!contenido) {
      throw new NotFoundException(`contenido con id ${id} no encontrada`);
    }
    return this.contenidoCurricularRepository.save(contenido); //guarda la materia actualizada en la base de datos
  }

  async remove(id:number){
    const contenido= await this.contenidoCurricularRepository.findOneBy({id});//busca la materia por id
    if(!contenido){
        throw new NotFoundException(`contenido con id ${id} no encontrada`);
    }
    return this.contenidoCurricularRepository.remove(contenido);//elimina la materia de la base de datos
}
}
