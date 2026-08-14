import { Controller, Get, Post, Body } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { CreateMateriaDto } from './dto/create-materia.dto';

@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Get()
  findAll() {
    return this.materiasService.findAll();
  }

  @Post()
  create(@Body() CreateMateriaDto: CreateMateriaDto) {
    return this.materiasService.create(CreateMateriaDto);
  }
}
