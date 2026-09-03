import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanificacionDetallesService } from './planificacion-detalles.service';
import { CreatePlanificacionDetalleDto } from './dto/create-planificacion-detalle.dto';
import { UpdatePlanificacionDetalleDto } from './dto/update-planificacion-detalle.dto';

@Controller('planificacion-detalles')
export class PlanificacionDetallesController {
  constructor(private readonly planificacionDetallesService: PlanificacionDetallesService) {}

  @Post()
  create(@Body() createPlanificacionDetalleDto: CreatePlanificacionDetalleDto) {
    return this.planificacionDetallesService.create(createPlanificacionDetalleDto);
  }

  @Get()
  findAll() {
    return this.planificacionDetallesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planificacionDetallesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanificacionDetalleDto: UpdatePlanificacionDetalleDto) {
    return this.planificacionDetallesService.update(+id, updatePlanificacionDetalleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planificacionDetallesService.remove(+id);
  }
}
