import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("scores")
export class PgScore {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column({ type: "int" })
    id_student!: number;

    @Column({ type: "int" })
    id_subject!: number;

    @Column({ type: "decimal", precision: 3, scale: 1, nullable: true })
    corte1!: number | null;

    @Column({ type: "decimal", precision: 3, scale: 1, nullable: true })
    corte2!: number | null;

    @Column({ type: "decimal", precision: 3, scale: 1, nullable: true })
    corte3!: number | null;

    @Column({ type: "decimal", precision: 3, scale: 1, nullable: true })
    notadefinitiva!: number | null;
}