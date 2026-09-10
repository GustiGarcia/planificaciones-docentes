import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanificacionDetallesService } from './planificacion-detalles.service';
import { PlanificacionDetallesController } from './planificacion-detalles.controller';
import { PlanificacionDetalle } from '../entities/planificacion-detalle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanificacionDetalle])],   // ← esta línea
  controllers: [PlanificacionDetallesController],
  providers: [PlanificacionDetallesService],
})
export class PlanificacionDetallesModule {}