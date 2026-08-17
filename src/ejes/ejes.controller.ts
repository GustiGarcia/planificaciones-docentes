import { Body, Controller, Get,Post,Patch,Delete ,Param } from '@nestjs/common';
import { EjesService } from './ejes.service';
import { UpdateEjesDto } from './dto/update-ejes.dto';
import { CreateEjesDto } from './dto/create-ejes.dto';

@Controller('ejes')
export class EjesController {
  constructor(
    private readonly ejesService: EjesService,
  ) {}

  @Get()
  findAll() {
    return this.ejesService.findAll();
  }
 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ejesService.findOne(+id);
  }

  @Post()
  create(@Body() CreateEjeDto: CreateEjesDto) {
    return this.ejesService.create(CreateEjeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEjeDto:UpdateEjesDto) {
    return this.ejesService.update(+id, updateEjeDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ejesService.remove(+id);
  }

}
