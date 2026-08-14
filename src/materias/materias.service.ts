import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Materia} from '../entities/materia.entity';
import {CreateMateriaDto} from './dto/create-materia.dto';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class MateriasService {
    constructor(
        @InjectRepository(Materia)
        private readonly materiaRepository: Repository<Materia>,
    ) {}

    findAll() {
        return this.materiaRepository.find();
    }

    async findOne(id: number) {
        const materia = await this.materiaRepository.findOneBy({ id });
        if (!materia) {
          throw new NotFoundException(`Materia con id ${id} no encontrada`);
        }
        return materia;
      }

    create(createMateriaDto:CreateMateriaDto){ //recibe un dto con los datos de la nueva materia y valida que sean correctos
        const nuevaMateria = this.materiaRepository.create(createMateriaDto);//dto valida los datos y crea una nueva materia
        return this.materiaRepository.save(nuevaMateria);//esto guarda la nueva materia en la base de datos
    }

    async update(id:number, updateMateriaDto:CreateMateriaDto){
        const materia= await this.materiaRepository.preload({id, ...updateMateriaDto});//preload busca la materia por id y actualiza los datos con los del dto
        if(!materia){
            throw new NotFoundException(`Materia con id ${id} no encontrada`);
        }
        return this.materiaRepository.save(materia);//guarda la materia actualizada en la base de datos
    }

    async remove(id:number){
        const materia= await this.materiaRepository.findOneBy({id});//busca la materia por id
        if(!materia){
            throw new NotFoundException(`Materia con id ${id} no encontrada`);
        }
        return this.materiaRepository.remove(materia);//elimina la materia de la base de datos
    }
}
