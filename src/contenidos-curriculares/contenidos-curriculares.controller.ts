import { Controller, Get } from '@nestjs/common';
import { ContenidosCurricularesService } from './contenidos-curriculares.service';

@Controller('contenidos-curriculares')
export class ContenidosCurricularesController {
  constructor(
    private readonly contenidosCurricularesService: ContenidosCurricularesService,
  ) {}

  @Get()
  findAll() {
    return this.contenidosCurricularesService.findAll();
  }
}
