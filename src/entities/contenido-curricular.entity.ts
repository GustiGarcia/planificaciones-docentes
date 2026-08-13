import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Materia } from './materia.entity';

@Entity('contenidos_curriculares')
export class ContenidoCurricular {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  anio: string;
  @Column({ type: 'text' })
  saberes: string;
  @ManyToOne(() => Materia, (materia) => materia.contenidosCurriculares) materia: Materia;
}
