import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materia } from './entities/materia.entity';
import { ContenidoCurricular } from './entities/contenido-curricular.entity';

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
      entities: [Materia, ContenidoCurricular],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
