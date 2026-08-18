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
      entities: [Materia, ContenidoCurricular,Eje,AprendizajeEspecifico ],
    }),
    MateriasModule,   // ← agregar esta línea (con coma antes)
    ContenidosCurricularesModule,
    EjesModule  // ← agregar esta línea (con coma antes)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}