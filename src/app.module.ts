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
import { Actividad } from './entities/actividad.entity';
import { Tema } from './entities/tema.entity';
import { MetodoEvaluacion } from './entities/metodo-evaluacion.entity';
import { EstrategiaEnsenanza } from './entities/estrategia-ensenanza.entity';
import { PlanificacionDetalle } from './entities/planificacion-detalle.entity';
import { Planificacion } from './entities/planificacion.entity';
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
        Actividad,
        AprendizajeEspecifico,
        ContenidoCurricular,
        Eje,
        EstrategiaEnsenanza,
        Materia,
        MetodoEvaluacion,
        PlanificacionDetalle,
        Planificacion,
        Tema,
        User,
      ],
    }),
    MateriasModule, // ← agregar esta línea (con coma antes)
    ContenidosCurricularesModule,
    EjesModule,
    AprendizajesEspecificosModule, // ← agregar esta línea (con coma antes)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
