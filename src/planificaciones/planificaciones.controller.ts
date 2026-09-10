import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanificacionesService } from './planificaciones.service';
import { CreatePlanificacionesDto } from './dto/create-planificaciones.dto';
import { UpdatePlanificacionesDto } from './dto/update-planificaciones.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CRUD planificaciones')
@Controller('planificaciones')
export class PlanificacionesController {
  constructor(private readonly planificacionesService: PlanificacionesService) {}

  @Post()
  create(@Body() createPlanificacioneDto: CreatePlanificacionesDto) {
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
  update(@Param('id') id: string, @Body() updatePlanificacioneDto: UpdatePlanificacionesDto) {
    return this.planificacionesService.update(+id, updatePlanificacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planificacionesService.remove(+id);
  }
}
