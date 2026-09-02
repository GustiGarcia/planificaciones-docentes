import { Body, Controller, Get,Post,Patch,Delete ,Param } from '@nestjs/common';
import { ContenidosCurricularesService } from './contenidos-curriculares.service';
import { UpdateContenidosCurricularesDto } from './dto/update-contenidos-curriculares';
import { CreateContenidosCurricularesDto } from './dto/create-contenidos-curriculares.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CRUD Contenidos Curriculares')
@Controller('contenidos-curriculares')
export class ContenidosCurricularesController {
  constructor(
    private readonly contenidosCurricularesService: ContenidosCurricularesService,
  ) {}

  @Get()
  findAll() {
    return this.contenidosCurricularesService.findAll();
  }
 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contenidosCurricularesService.findOne(+id);
  }

  @Post()
  create(@Body() CreateMateriaDto: CreateContenidosCurricularesDto) {
    return this.contenidosCurricularesService.create(CreateMateriaDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMateriaDto:UpdateContenidosCurricularesDto) {
    return this.contenidosCurricularesService.update(+id, updateMateriaDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contenidosCurricularesService.remove(+id);
  }

}
