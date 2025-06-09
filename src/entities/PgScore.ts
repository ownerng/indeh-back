import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { PgSubject } from "./PgSubject";
import { PgStudent } from "./PgStudent";

@Entity("scores")
export class PgScore {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @ManyToOne(() => PgStudent, (user) => user.id, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "id_student" })
    id_student!: PgStudent;

    @ManyToOne(() => PgSubject, (user) => user.id, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "id_subject" })
    id_subject!: PgSubject;

    @Column({ type: "decimal", precision: 3, scale: 1, nullable: true })
    corte1!: number | null;

    @Column({ type: "decimal", precision: 3, scale: 1, nullable: true })
    corte2!: number | null;

    @Column({ type: "decimal", precision: 3, scale: 1, nullable: true })
    corte3!: number | null;

    @Column({ type: "decimal", precision: 3, scale: 1, nullable: true })
    notadefinitiva!: number | null;
}