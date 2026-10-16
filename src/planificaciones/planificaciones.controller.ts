import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PlanificacionesService } from './planificaciones.service';
import { PlanificacionesWordService } from './planificaciones-word.service';
import { CreatePlanificacionesDto } from './dto/create-planificaciones.dto';
import { UpdatePlanificacionesDto } from './dto/update-planificaciones.dto';
import { DocumentoPlanificacionDto } from './dto/documento-planificacion.dto';
import { ApiTags, ApiOperation, ApiProduces } from '@nestjs/swagger';

@ApiTags('CRUD planificaciones')
@Controller('planificaciones')
export class PlanificacionesController {
  constructor(
    private readonly planificacionesService: PlanificacionesService,
    private readonly wordService: PlanificacionesWordService,
  ) {}

  @Post()
  create(@Body() createPlanificacioneDto: CreatePlanificacionesDto) {
    return this.planificacionesService.create(createPlanificacioneDto);
  }

  @Get()
  findAll() {
    return this.planificacionesService.findAll();
  }

  /* Descarga la planificación como documento de Word.
     Va declarada ANTES de @Get(':id') por costumbre sana: las rutas
     se evalúan en orden y conviene que las más específicas vayan
     primero. (Acá igual no chocarían, porque ':id' no matchea un
     segmento con barra, pero el día que agregues ':id/pdf' la
     costumbre te salva.)

     El @Res() es la excepción al "return y listo" de Nest: cuando
     devolvés un archivo necesitás escribir vos los headers y mandar
     el buffer. Ojo: al usar @Res(), Nest DEJA de manejar la
     respuesta — si no llamás a res.send(), la request queda colgada
     para siempre. Por eso el throw queda a cargo del service, antes
     de tocar res. */
  @Get(':id/word')
  @ApiOperation({ summary: 'Descarga la planificación en formato Word' })
  @ApiProduces(
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  )
  async exportarWord(@Param('id') id: string, @Res() res: Response) {
    // findOne ya trae los detalles con todas sus relaciones, y tira
    // NotFoundException si no existe.
    const planificacion = await this.planificacionesService.findOne(+id);
    const documento = this.wordService.desdeEntidad(planificacion);

    await this.responderWord(res, documento);
  }

  /* Genera el Word SIN guardar nada.
     El docente arma la planificación en pantalla y se lleva el
     documento para revisarlo; recién guarda cuando está conforme.

     Es POST y no GET porque manda el contenido en el cuerpo: un GET
     no lleva body, y meter una planificación entera en la URL no
     entra ni se lee. Pero ojo con el nombre: POST acá NO crea nada
     en la base. Es "procesá esto y devolvemelo convertido".

     Va antes de @Get(':id') y de @Post() por orden de lectura; como
     es otro verbo y otra ruta, no hay riesgo de choque. */
  @Post('word')
  @ApiOperation({
    summary: 'Genera el Word de una planificación sin guardarla',
  })
  @ApiProduces(
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  )
  async exportarWordSinGuardar(
    @Body() documento: DocumentoPlanificacionDto,
    @Res() res: Response,
  ) {
    await this.responderWord(res, documento);
  }

  /* Los headers de la descarga, en un solo lugar: las dos rutas de
     arriba devuelven exactamente el mismo tipo de respuesta. */
  private async responderWord(
    res: Response,
    documento: DocumentoPlanificacionDto,
  ) {
    const buffer = await this.wordService.generar(documento);
    const nombre = this.wordService.nombreArchivo(documento);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // attachment = descargar, no abrir en el navegador.
      'Content-Disposition': `attachment; filename="${nombre}"`,
      'Content-Length': buffer.length.toString(),
      // Sin esto el front no puede leer el nombre del archivo:
      // CORS esconde los headers que no estén expuestos.
      'Access-Control-Expose-Headers': 'Content-Disposition',
    });

    res.send(buffer);
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
