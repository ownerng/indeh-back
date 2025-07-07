import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

@Entity("ciclos")
export class PgCiclo {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column()
    nombre_ciclo!: string;

}