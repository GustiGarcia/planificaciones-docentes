import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('temas')
export class Tema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  nombre: string;

  @Column({ default: true })
  esPredefinida: boolean;
  
  @ManyToOne(() => User, { nullable: true })
  user: User;
}
