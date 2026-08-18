import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { AprendizajeEspecificoController } from "./aprendizajes-especificos.controller";
import { AprendizajesEspecificosService } from "./aprendizajes-especificos.service";
import { AprendizajeEspecifico } from "src/entities/aprendizaje-especifico.entity";

@Module({
    imports: [TypeOrmModule.forFeature([AprendizajeEspecifico])],
    controllers: [AprendizajeEspecificoController],
    providers: [AprendizajesEspecificosService],
})
export class AprendizajesEspecificosModule {}