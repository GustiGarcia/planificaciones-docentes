import { Module } from '@nestjs/common';
import { MetodosEvaluacionService } from './metodos-evaluacion.service';
import { MetodosEvaluacionController } from './metodos-evaluacion.controller';
import { MetodoEvaluacion } from 'src/entities/metodo-evaluacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [MetodosEvaluacionController],
  providers: [MetodosEvaluacionService],
  imports: [TypeOrmModule.forFeature([MetodoEvaluacion])],

})
export class MetodosEvaluacionModule {}
