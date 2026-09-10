import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Planificacion } from './planificacion.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nombre: string;
  @Column({ unique: true })
  email: string;
  @Column({ default: 'docente' })
  rol: string;
  @OneToMany(() => Planificacion, (planificacion) => planificacion.user)
  planificaciones: Planificacion[];
}
