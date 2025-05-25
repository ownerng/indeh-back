import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { PgCalification } from "./PgCalification";

@Entity("subjects")
export class PgSubject {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Column({ type: "varchar", length: 255 })
    nombre!: string;

    @Column({ type: "int" })
    teacherId!: number;

    @Column({ type: "enum", enum: ["Activo", "Inactivo"], default: "Activo" })
    estado!: "Activo" | "Inactivo";

    @CreateDateColumn()
    fecha_creacion!: Date;

    @UpdateDateColumn()
    fecha_modificacion!: Date;

    @OneToMany(() => PgCalification, (calification) => calification.subject)
    califications!: PgCalification[];
}