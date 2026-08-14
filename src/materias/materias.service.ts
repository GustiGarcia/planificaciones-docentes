import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Materia} from '../entities/materia.entity';
import {CreateMateriaDto} from './dto/create-materia.dto';
@Injectable()
export class MateriasService {
    constructor(
        @InjectRepository(Materia)
        private readonly materiaRepository: Repository<Materia>,
    ) {}

    findAll() {
        return this.materiaRepository.find();
    }

    create(createMateriaDto:CreateMateriaDto){ //recibe un dto con los datos de la nueva materia y valida que sean correctos
        const nuevaMateria = this.materiaRepository.create(createMateriaDto);//dto valida los datos y crea una nueva materia
        return this.materiaRepository.save(nuevaMateria);//esto guarda la nueva materia en la base de datos
    }
}