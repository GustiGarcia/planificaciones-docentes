import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ContenidoCurricular} from "../entities/contenido-curricular.entity";
import {ContenidosCurricularesService} from "./contenidos-curriculares.service";
import {ContenidosCurricularesController} from "./contenidos-curriculares.controller";

@Module({
    imports: [TypeOrmModule.forFeature([ContenidoCurricular])],
    controllers: [ContenidosCurricularesController],
    providers: [ContenidosCurricularesService],
})
export class ContenidosCurricularesModule {}