import { Module } from '@nestjs/common';
import { PlanificacionesService } from './planificaciones.service';
import { PlanificacionesController } from './planificaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planificacion } from 'src/entities/planificacion.entity';

@Module({
  controllers: [PlanificacionesController],
  providers: [PlanificacionesService],
  imports :[TypeOrmModule.forFeature([Planificacion])]
})
export class PlanificacionesModule {}
