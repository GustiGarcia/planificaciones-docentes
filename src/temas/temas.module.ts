import { Module } from '@nestjs/common';
import { TemasService } from './temas.service';
import { TemasController } from './temas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tema } from 'src/entities/tema.entity';

@Module({
  controllers: [TemasController],
  providers: [TemasService],
  imports:[TypeOrmModule.forFeature([Tema])]
})
export class TemasModule {}
