import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContenidoCurricular } from "../entities/contenido-curricular.entity";

@Injectable()
export class ContenidosCurricularesService {
    constructor(
        @InjectRepository(ContenidoCurricular)
        private readonly contenidoCurricularRepository: Repository<ContenidoCurricular>,
    ) {}

    findAll() {
        return this.contenidoCurricularRepository.find();
    }
}