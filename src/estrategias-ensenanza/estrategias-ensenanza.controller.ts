import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstrategiasEnsenanzaService } from './estrategias-ensenanza.service';
import { CreateEstrategiasEnsenanzaDto } from './dto/create-estrategias-ensenanza.dto';
import { UpdateEstrategiasEnsenanzaDto } from './dto/update-estrategias-ensenanza.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CRUD Estrategias-Enseñanza')
@Controller('estrategias-ensenanza')
export class EstrategiasEnsenanzaController {
  constructor(private readonly estrategiasEnsenanzaService: EstrategiasEnsenanzaService) {}

  @Post()
  create(@Body() createEstrategiasEnsenanzaDto: CreateEstrategiasEnsenanzaDto) {
    return this.estrategiasEnsenanzaService.create(createEstrategiasEnsenanzaDto);
  }

  @Get()
  findAll() {
    return this.estrategiasEnsenanzaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estrategiasEnsenanzaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstrategiasEnsenanzaDto: UpdateEstrategiasEnsenanzaDto) {
    return this.estrategiasEnsenanzaService.update(+id, updateEstrategiasEnsenanzaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estrategiasEnsenanzaService.remove(+id);
  }
}
