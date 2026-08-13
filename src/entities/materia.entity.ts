import { Entity, PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";
import { ContenidoCurricular } from "./contenido-curricular.entity";

@Entity('materias')
export class Materia {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string;
    @Column()
    orientacion: string;

    @OneToMany(() => ContenidoCurricular, (contenido) => contenido.materia)
    contenidosCurriculares: ContenidoCurricular[];
}