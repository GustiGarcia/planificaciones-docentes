import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Materia } from './materia.entity';
import { ContenidoCurricular } from './contenido-curricular.entity';

@Entity('ejes')
export class Eje {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nombre: string;
  // Hacia arriba: este eje PERTENECE a una materia
  @ManyToOne(() => Materia, (materia) => materia.ejes)
  materia: Materia;

  // Hacia abajo: este eje TIENE muchos contenidos
  @OneToMany(() => ContenidoCurricular, (contenido) => contenido.eje)
  contenidos: ContenidoCurricular[];
}
