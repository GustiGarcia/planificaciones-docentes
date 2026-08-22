import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanificacionesService } from './planificaciones.service';
import { CreatePlanificacioneDto } from './dto/create-planificacione.dto';
import { UpdatePlanificacioneDto } from './dto/update-planificacione.dto';

@Controller('planificaciones')
export class PlanificacionesController {
  constructor(private readonly planificacionesService: PlanificacionesService) {}

  @Post()
  create(@Body() createPlanificacioneDto: CreatePlanificacioneDto) {
    return this.planificacionesService.create(createPlanificacioneDto);
  }

  @Get()
  findAll() {
    return this.planificacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planificacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanificacioneDto: UpdatePlanificacioneDto) {
    return this.planificacionesService.update(+id, updatePlanificacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planificacionesService.remove(+id);
  }
}
