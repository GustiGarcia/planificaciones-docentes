import { Body, Controller, Get,Post,Patch,Delete ,Param } from '@nestjs/common';
import { AprendizajeEspecifico } from 'src/entities/aprendizaje-especifico.entity';
import { CreateAprendizajeEspecificoDto } from './dto/create-aprendizajes-especificos.dto';
import { UpdateAprendizajeEspecificoDto } from './dto/update-aprendizajes-especificos.dto';
import { AprendizajesEspecificosService } from './aprendizajes-especificos.service';
@Controller('aprendizajes-especificos')
export class AprendizajeEspecificoController {
  constructor(
    private readonly aprendizajesEspecificosService: AprendizajesEspecificosService,
  ) {}

  @Get()
  findAll() {
    return this.aprendizajesEspecificosService.findAll();
  }
 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aprendizajesEspecificosService.findOne(+id);
  }

  @Post()
  create(@Body() CreateApEspecificoDto: CreateAprendizajeEspecificoDto) {
    return this.aprendizajesEspecificosService.create(CreateApEspecificoDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApEspecificoDto:UpdateAprendizajeEspecificoDto) {
    return this.aprendizajesEspecificosService.update(+id, updateApEspecificoDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aprendizajesEspecificosService.remove(+id);
  }

}
