import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { Eje } from "src/entities/eje.entity";
import { EjesController } from "./ejes.controller";
import { EjesService } from "./ejes.service";

@Module({
    imports: [TypeOrmModule.forFeature([Eje])],
    controllers: [EjesController],
    providers: [EjesService],
})
export class EjesModule {}