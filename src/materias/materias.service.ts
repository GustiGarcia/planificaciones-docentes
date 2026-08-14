import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Materia} from '../entities/materia.entity';

@Injectable()
export class MateriasService {
    constructor(
        @InjectRepository(Materia)
        private readonly materiaRepository: Repository<Materia>,
    ) {}

    findAll() {
        return this.materiaRepository.find();
    }
}