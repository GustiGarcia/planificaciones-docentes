/* ═══════════════════════════════════════════════════════════════
   ENTITY: Planificacion
   Tabla: "planificaciones"

   Es la CABECERA del documento: los datos que van arriba de todo
   en el PDF y que no se repiten. El "quién, qué y cuándo".
   Las filas de la tabla vienen después, en PlanificacionDetalle.
   ═══════════════════════════════════════════════════════════════ */

import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { Materia } from './materia.entity';
import { PlanificacionDetalle } from './planificacion-detalle.entity';

// @Entity('planificaciones')
// Marca esta clase como una tabla de la base de datos.
// El texto entre paréntesis es el nombre REAL de la tabla en Postgres.
// Sin este decorador, TypeORM no sabe que existe (error clásico: falta la @).
@Entity('planificaciones')
export class Planificacion {
  // Clave primaria autoincremental. Postgres le asigna 1, 2, 3...
  // Nunca la mandás vos; la genera la base sola.
  @PrimaryGeneratedColumn()
  id: number;

  // Columna de texto simple. Ej: "3°2", "1°1"
  @Column()
  cursoDivision: string;

  // number (minúscula) → Postgres crea un integer.
  // Lo elegimos numérico para poder ordenar y filtrar:
  // WHERE anioLectivo >= 2025
  @Column()
  anioLectivo: number;

  // @CreateDateColumn() es un @Column especial:
  // TypeORM le pone fecha y hora AUTOMÁTICAMENTE en el INSERT.
  // No la mandás desde el DTO ni desde Postman. Se llena sola.
  // (Existe @UpdateDateColumn() que se refresca en cada save()).
  @CreateDateColumn()
  fechaCreacion: Date;

  /* ─────────────────────────────────────────────────────────────
     RELACIÓN 1: Planificacion → User

     @ManyToOne = "MUCHAS planificaciones pertenecen a UN user".
     El lado ManyToOne es SIEMPRE el que guarda la clave foránea:
     TypeORM crea la columna "userId" en la tabla planificaciones.

     Primer argumento  → () => User
        A QUÉ entity apunta. Va como función (arrow) para evitar
        problemas de imports circulares.

     Segundo argumento → (user) => user.planificaciones
        El LADO INVERSO. Le dice a TypeORM: "en la clase User existe
        una propiedad llamada planificaciones que apunta de vuelta acá".
        REGLA DE ORO: acá se nombra la propiedad que existe en el
        OTRO archivo, no en este.

     Nombre de la propiedad → user
        Cómo la vas a usar en tu código: planificacion.user.nombre
        Tiene que coincidir con lo que apunta el decorador.
        (Si el decorador dice User, la propiedad se llama user y es
        de tipo User. Confundir esto es el error más común.)
     ───────────────────────────────────────────────────────────── */
  @ManyToOne(() => User, (user) => user.planificaciones)
  user: User;

  /* ─────────────────────────────────────────────────────────────
     RELACIÓN 2: Planificacion → Materia

     Misma lógica: MUCHAS planificaciones son de UNA materia.
     Genera la columna "materiaId" en planificaciones.

     En materia.entity.ts está el espejo de esta línea:
        @OneToMany(() => Planificacion, (p) => p.materia)
        planificaciones: Planificacion[];

     Los dos lados se nombran mutuamente. Si uno de los dos nombres
     no coincide, TypeORM tira un error críptico al arrancar.
     ───────────────────────────────────────────────────────────── */
  @ManyToOne(() => Materia, (materia) => materia.planificaciones)
  materia: Materia;

  @OneToMany(() => PlanificacionDetalle, (detalle) => detalle.planificacion)
  detalles: Planificacion[];
}
