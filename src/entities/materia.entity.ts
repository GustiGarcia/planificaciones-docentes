import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Eje } from './eje.entity';
import { Planificacion } from './planificacion.entity';
@Entity('materias')
export class Materia {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nombre: string;
  @Column()
  orientacion: string;

  @OneToMany(() => Eje, (eje) => eje.materia)
  ejes: Eje[];

  @OneToMany(() => Planificacion, (planificacion) => planificacion.materia)
  planificaciones: Planificacion[];
}
