import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { PgStudent } from "./PgStudent";

@Entity("anexos")
export class PgAnexo {
    @PrimaryColumn("uuid")
    id!: string;

    @Column("uuid") // This will store the student's ID
    id_student!: string;

    @Column({ type: "varchar", length: 2048 }) // Adjust length as needed
    url!: string;

    @CreateDateColumn()
    fecha_creacion!: Date;

    @ManyToOne(() => PgStudent) // Assuming PgStudent has an 'anexos' collection
    @JoinColumn({ name: "id_student" }) // Specifies that 'id_student' column is the foreign key for this relation
    student!: PgStudent;
}