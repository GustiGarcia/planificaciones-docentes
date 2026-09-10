import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetodosEvaluacionService } from './metodos-evaluacion.service';
import { CreateMetodosEvaluacionDto } from './dto/create-metodos-evaluacion.dto';
import { UpdateMetodosEvaluacionDto } from './dto/update-metodos-evaluacion.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CRUD metodos evaluacion')
@Controller('metodos-evaluacion')
export class MetodosEvaluacionController {
  constructor(private readonly metodosEvaluacionService: MetodosEvaluacionService) {}

  @Post()
  create(@Body() createMetodosEvaluacionDto: CreateMetodosEvaluacionDto) {
    return this.metodosEvaluacionService.create(createMetodosEvaluacionDto);
  }

  @Get()
  findAll() {
    return this.metodosEvaluacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodosEvaluacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetodosEvaluacionDto: UpdateMetodosEvaluacionDto) {
    return this.metodosEvaluacionService.update(+id, updateMetodosEvaluacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metodosEvaluacionService.remove(+id);
  }
}
