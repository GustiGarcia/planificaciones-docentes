import { Controller, Get, Post, Body, Param, Patch, Delete} from '@nestjs/common';
import { MateriasService } from './materias.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Crud Materias')
@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Get()
  findAll() {
    return this.materiasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materiasService.findOne(+id);
  }

  @Post()
  create(@Body() CreateMateriaDto: CreateMateriaDto) {
    return this.materiasService.create(CreateMateriaDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMateriaDto: CreateMateriaDto) {
    return this.materiasService.update(+id, updateMateriaDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materiasService.remove(+id);
  }
}
