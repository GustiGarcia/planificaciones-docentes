/* ═══════════════════════════════════════════════════════════════
   ENTITY: PlanificacionDetalle
   Tabla: "planificacion_detalles"

   Representa UNA FILA de la tabla del PDF.
   Si la planificación de 3°2 tiene 8 saberes → 8 registros de estos.

   Junta dos mundos:
     · Lo que viene del DCP  → contenidoCurricular + aprendizajes
     · Lo que aporta el docente → estrategias, actividades,
                                  métodos de evaluación, temas
   ═══════════════════════════════════════════════════════════════ */

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Planificacion } from './planificacion.entity';
import { ContenidoCurricular } from './contenido-curricular.entity';
import { AprendizajeEspecifico } from './aprendizaje-especifico.entity';
import { EstrategiaEnsenanza } from './estrategia-ensenanza.entity';
import { Actividad } from './actividad.entity';
import { MetodoEvaluacion } from './metodo-evaluacion.entity';
import { Tema } from './tema.entity';

@Entity('planificacion_detalles')
export class PlanificacionDetalle {

  @PrimaryGeneratedColumn()
  id: number;

  /* ─────────────────────────────────────────────────────────────
     A QUÉ PLANIFICACIÓN PERTENECE  (bidireccional)

     Muchos detalles → una planificación. Genera "planificacionId".

     Lleva segundo argumento porque SÍ vas a navegar al revés:
     para armar el PDF pedís la planificación con sus detalles.
     Su espejo vive en planificacion.entity.ts:
        @OneToMany(() => PlanificacionDetalle, (d) => d.planificacion)
     ───────────────────────────────────────────────────────────── */
  @ManyToOne(() => Planificacion, (planificacion) => planificacion.detalles)
  planificacion: Planificacion;

  /* ─────────────────────────────────────────────────────────────
     EL SABER DEL DCP  (unidireccional)

     Un detalle trabaja UN saber. Genera "contenidoCurricularId".

     SIN segundo argumento: nunca vas a preguntar "¿en qué
     planificaciones se usó este saber?". El DCP no se entera
     de quién lo usa, y está bien así.
     ───────────────────────────────────────────────────────────── */
  @ManyToOne(() => ContenidoCurricular)
  contenidoCurricular: ContenidoCurricular;

  /* ─────────────────────────────────────────────────────────────
     LOS 5 CAMPOS MUCHOS-A-MUCHOS

     Patrón idéntico en los cinco:
       @ManyToMany(() => X)   → declara la relación
       @JoinTable()           → ORDENA crear la tabla intermedia
       nombre: X[]            → array, porque son varios

     Cada @JoinTable() genera una tabla oculta con solo dos
     columnas de ids. Ej: planificacion_detalles_estrategias
       ┌────────────────────────┬──────────────────────┐
       │ planificacionDetalleId │ estrategiaEnsenanzaId│
       └────────────────────────┴──────────────────────┘

     ⚠️ @JoinTable() va SOLO de este lado. Los catálogos no lo
        llevan. Si estuviera en los dos lados → error al arrancar.
     ───────────────────────────────────────────────────────────── */

  // Los aprendizajes específicos del DCP que elegiste para este saber
  @ManyToMany(() => AprendizajeEspecifico)
  @JoinTable()
  aprendizajes: AprendizajeEspecifico[];

  // Columna "ESTRATEGIA ENSEÑANZA-APRENDIZAJE" del PDF
  @ManyToMany(() => EstrategiaEnsenanza)
  @JoinTable()
  estrategias: EstrategiaEnsenanza[];

  @ManyToMany(() => Actividad)
  @JoinTable()
  actividades: Actividad[];

  // Columna "EVALUACIÓN" del PDF
  @ManyToMany(() => MetodoEvaluacion)
  @JoinTable()
  metodosEvaluacion: MetodoEvaluacion[];

  // Columna "ABP" del PDF
  @ManyToMany(() => Tema)
  @JoinTable()
  temas: Tema[];
}