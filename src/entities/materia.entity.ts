import { Entity, PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";
import { Eje } from "./eje.entity";

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
}