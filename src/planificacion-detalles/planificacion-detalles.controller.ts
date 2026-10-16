import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PlanificacionDetallesService } from './planificacion-detalles.service';
import { CreatePlanificacionDetalleDto } from './dto/create-planificacion-detalle.dto';
import { UpdatePlanificacionDetalleDto } from './dto/update-planificacion-detalle.dto';
import { ApiTags } from '@nestjs/swagger';

// Era el único controller sin @ApiTags: en Swagger sus rutas
// quedaban sueltas, fuera de los grupos.
@ApiTags('CRUD planificacion-detalles')
@Controller('planificacion-detalles')
export class PlanificacionDetallesController {
  constructor(private readonly planificacionDetallesService: PlanificacionDetallesService) {}

  @Post()
  create(@Body() createPlanificacionDetalleDto: CreatePlanificacionDetalleDto) {
    return this.planificacionDetallesService.create(createPlanificacionDetalleDto);
  }

  // ?planificacionId=3 → solo las filas de esa planificación.
  // Sin el parámetro, todas. Mismo patrón que contenidos-curriculares.
  @Get()
  findAll(@Query('planificacionId') planificacionId?: string) {
    return this.planificacionDetallesService.findAll(planificacionId);
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
