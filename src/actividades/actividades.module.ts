import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { Actividad } from 'src/entities/actividad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ActividadesController],
  providers: [ActividadesService],
  imports: [TypeOrmModule.forFeature([Actividad])],
})
export class ActividadesModule {}
