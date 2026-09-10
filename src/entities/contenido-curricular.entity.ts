import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , OneToMany} from 'typeorm';
import { Eje } from './eje.entity';
import { AprendizajeEspecifico } from './aprendizaje-especifico.entity';

@Entity('contenidos_curriculares')
export class ContenidoCurricular {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  anio: string;
  @Column({ type: 'text' })
  saberes: string;
  @ManyToOne(() => Eje, (eje) => eje.contenidos) eje: Eje;
  @OneToMany(
    () => AprendizajeEspecifico,
    (aprendizaje) => aprendizaje.contenidoCurricular,
  )
  aprendizajes: AprendizajeEspecifico[];
}
