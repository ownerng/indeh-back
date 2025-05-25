import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { PgUser } from "./PgUser";


@Entity("subjects")
export class PgSubject {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column({ type: "varchar", length: 255 })
    nombre!: string;

    @CreateDateColumn()
    fecha_creacion!: Date;

    @ManyToOne(() => PgUser)
    @JoinColumn({ name: "id_profesor" })
    profesor!: PgUser;
}