import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materia } from './entities/materia.entity';
import { ContenidoCurricular } from './entities/contenido-curricular.entity';
import { MateriasModule } from './materias/materias.module';
import { ContenidosCurricularesModule } from './contenidos-curriculares/contenidos-curriculares.module';
import { Eje } from './entities/eje.entity';
import { EjesModule } from './ejes/ejes.module';
import { AprendizajeEspecifico } from './entities/aprendizaje-especifico.entity';
import { AprendizajesEspecificosModule } from './aprendizajes-especificos/aprendizajes-especificos.module';
import { User } from './entities/user.entity';
import { PlanificacionDetalle } from './entities/planificacion-detalle.entity';
import { Planificacion } from './entities/planificacion.entity';
import { TemasModule } from './temas/temas.module';
import { ActividadesModule } from './actividades/actividades.module';
import { MetodosEvaluacionModule } from './metodos-evaluacion/metodos-evaluacion.module';
import { EstrategiasEnsenanzaModule } from './estrategias-ensenanza/estrategias-ensenanza.module';
import { PlanificacionesModule } from './planificaciones/planificaciones.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'planificaciones_db',
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        AprendizajeEspecifico,
        ContenidoCurricular,
        Eje,
        Materia,
        PlanificacionDetalle,
        User,
      ],
    }),
    MateriasModule, // ← agregar esta línea (con coma antes)
    ContenidosCurricularesModule,
    EjesModule,
    AprendizajesEspecificosModule,
    TemasModule,
    ActividadesModule,
    MetodosEvaluacionModule,
    EstrategiasEnsenanzaModule,
    PlanificacionesModule, // ← agregar esta línea (con coma antes)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
