import { Module } from '@nestjs/common';
import { PlanificacionesService } from './planificaciones.service';
import { PlanificacionesWordService } from './planificaciones-word.service';
import { PlanificacionesController } from './planificaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planificacion } from 'src/entities/planificacion.entity';

@Module({
  controllers: [PlanificacionesController],
  // El service de Word va acá como un provider más. Si falta, Nest
  // tira UnknownDependenciesException al inyectarlo en el controller:
  // el mismo error que da un forFeature olvidado.
  providers: [PlanificacionesService, PlanificacionesWordService],
  imports :[TypeOrmModule.forFeature([Planificacion])]
})
export class PlanificacionesModule {}
