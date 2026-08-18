import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ContenidoCurricular } from './contenido-curricular.entity';

@Entity('aprendizajes_especificos')
export class AprendizajeEspecifico {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'text' })
  descripcion: string;
  @ManyToOne(() => ContenidoCurricular, (contenido) => contenido.aprendizajes)
  contenidoCurricular: ContenidoCurricular;
}
