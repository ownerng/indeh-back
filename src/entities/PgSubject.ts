import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { PgUser } from "./PgUser";
import { Jornada } from "./Jornada";


@Entity("subjects")
export class PgSubject {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column({ type: "varchar", length: 255 })
    nombre!: string;

    @Column({
        type: "enum",
        enum: Jornada
    })
    jornada!: Jornada;

    @Column({ type: "varchar", length: 255 })
    ciclo!: string | null;


    @CreateDateColumn()
    fecha_creacion!: Date;

    @ManyToOne(() => PgUser, (user) => user.id, {
        onDelete: "CASCADE",
        nullable: true
    })
    @JoinColumn({ name: "id_profesor" })
    profesor!: PgUser | null;
}