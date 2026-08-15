import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Eje } from './eje.entity';

@Entity('contenidos_curriculares')
export class ContenidoCurricular {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  anio: string;
  @Column({ type: 'text' })
  saberes: string;
  @ManyToOne(() => Eje, (eje) => eje.contenidos) eje: Eje;
}
