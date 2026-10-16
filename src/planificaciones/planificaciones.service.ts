import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanificacionesDto } from './dto/create-planificaciones.dto';
import { UpdatePlanificacionesDto } from './dto/update-planificaciones.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planificacion } from 'src/entities/planificacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanificacionesService {
  constructor(
    @InjectRepository(Planificacion)
    private readonly planificacionRepository: Repository<Planificacion>,
  ) {}

  create(createPlanificacioneDto: CreatePlanificacionesDto) {
    const { userId, materiaId, ...resto } = createPlanificacioneDto;
    const nueva = this.planificacionRepository.create({
      ...resto,
      user: { id: userId },
      materia: { id: materiaId },
    });
    return this.planificacionRepository.save(nueva);
  }

  findAll() {
    return this.planificacionRepository.find({
      relations: {user:true, materia:true},
    });
  }

  // Trae la planificación COMPLETA: la cabecera y todas sus filas,
  // cada una con su saber y las cinco columnas del docente.
  //
  // Es el documento entero en una sola consulta. Lo necesitan dos
  // cosas: reabrir una planificación guardada para seguir editándola,
  // y generar el Word/PDF desde el backend.
  //
  // Cómo se leen las relaciones anidadas:
  //   user: true        → "traeme el usuario"
  //   detalles: { ... } → "traeme los detalles, y de CADA detalle
  //                        traeme además lo que va adentro"
  //
  // No hace falta pedir "planificacion" dentro de cada detalle:
  // sería volver al punto de partida, la planificación que ya
  // estamos trayendo.
  //
  // Es deliberadamente distinto de findAll: ahí se lista
  // "mis planificaciones" y solo se muestran curso, materia y año.
  // Traer los detalles de todas sería traer la base entera.
  async findOne(id: number) {
    const planificacion = await this.planificacionRepository.findOne({
      where: { id },
      relations: {
        user: true,
        materia: true,
        detalles: {
          /* El eje va adentro del contenido porque es la primera
             columna del documento, y al generar el Word de una
             planificación GUARDADA no hay otra forma de saberlo:
             el detalle apunta al saber, y el eje cuelga del saber. */
          contenidoCurricular: { eje: true },
          aprendizajes: true,
          estrategias: true,
          actividades: true,
          metodosEvaluacion: true,
          temas: true,
        },
      },
    });
    if (!planificacion) {
      throw new NotFoundException(`Planificacion con id ${id} no encontrada`);
    }
    return planificacion;
  }

  async update(id: number, updatePlanificacioneDto: UpdatePlanificacionesDto) {
    const { userId, materiaId, ...resto } = updatePlanificacioneDto;
    const planificacion = await this.planificacionRepository.preload({
      id,
      ...resto,
      ...(userId && { user: { id: userId } }),
      ...(materiaId && { materia: { id: materiaId } }),
    });
    if (!planificacion) {
      throw new NotFoundException(`planificacion con id ${id} no encontrada`);
    }
    return this.planificacionRepository.save(planificacion);
  }

  async remove(id: number) {
    const planificacion = await this.planificacionRepository.findOneBy({ id });
    if (!planificacion) {
      throw new NotFoundException(`planificacion con id ${id} no encontrada`);
    }
    return this.planificacionRepository.remove(planificacion);
  }
}
