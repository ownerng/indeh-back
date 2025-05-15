import { Entity, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { PgStudent } from "./PgStudent";
import { PgSubject } from "./PgSubject";
// import { PgSubject } from "./PgSubject"; // You'll need a PgSubject entity for this relation

@Entity("califications")
export class PgCalification {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: "uuid" })
    id_student!: string;

    @Column({ type: "uuid" }) // Assuming id_subject is also a uuid
    id_subject!: string;

    @Column({ type: "decimal", precision: 2, scale: 1, nullable: true })
    calificacion!: number | null;

    @CreateDateColumn()
    fecha_creacion!: Date;

    @UpdateDateColumn({ nullable: true })
    fecha_modificacion!: Date | null;

    @ManyToOne(() => PgStudent, (student) => student.califications)
    @JoinColumn({ name: "id_student" }) // Specifies the foreign key column
    student!: PgStudent;

    // Example for Subject relationship (assuming you have a PgSubject entity)
    @ManyToOne(() => PgSubject, (subject) => subject.califications) // Replace 'califications' with the property name in PgSubject
    @JoinColumn({ name: "id_subject" })
    subject!: PgSubject;
}