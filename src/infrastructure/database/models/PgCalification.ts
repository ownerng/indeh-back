import { Entity, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { PgStudent } from "./PgStudent";
import { PgSubject } from "./PgSubject";

@Entity("califications")
export class PgCalification {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: "uuid" })
    id_student!: string;

    @Column({ type: "uuid" })
    id_subject!: string;

    @Column({ type: "decimal", precision: 2, scale: 1, nullable: true })
    corte1!: number | null;

    @Column({ type: "decimal", precision: 2, scale: 1, nullable: true })
    corte2!: number | null;

    @Column({ type: "decimal", precision: 2, scale: 1, nullable: true })
    corte3!: number | null;

    @Column({ type: "decimal", precision: 2, scale: 1, nullable: true })
    definitiva!: number | null;

    @CreateDateColumn()
    fecha_creacion!: Date;

    @UpdateDateColumn({ nullable: true })
    fecha_modificacion!: Date | null;

    @ManyToOne(() => PgStudent, (student) => student.califications)
    @JoinColumn({ name: "id_student" })
    student!: PgStudent;

    @ManyToOne(() => PgSubject, (subject) => subject.califications)
    @JoinColumn({ name: "id_subject" })
    subject!: PgSubject;
}