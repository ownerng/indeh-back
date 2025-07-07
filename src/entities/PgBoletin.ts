import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from "typeorm";
import { PgStudent } from "./PgStudent";

@Entity("boletines")
export class PgBoletin {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @ManyToOne(() => PgStudent, { eager: true })
    @JoinColumn({ name: "id_student" })
    student!: PgStudent;

    @Column()
    id_student!: number;

    @CreateDateColumn()
    fecha_creacion!: Date;

    @Column()
    state!: string;

    @Column()
    puesto!: number;

    // Materias
    @Column("float", { default: 0 }) castellano_corte1!: number;
    @Column("float", { default: 0 }) castellano_corte2!: number;
    @Column("float", { default: 0 }) castellano_corte3!: number;
    @Column("varchar", { default: "" }) castellano_desem1!: string;
    @Column("varchar", { default: "" }) castellano_desem2!: string;
    @Column("varchar", { default: "" }) castellano_desem3!: string;
    @Column("float", { default: 0 }) castellano_porcentual1!: number;
    @Column("float", { default: 0 }) castellano_porcentual2!: number;
    @Column("float", { default: 0 }) castellano_porcentual3!: number;
    @Column("float", { default: 0 }) castellano_def!: number;
    @Column("varchar", { default: "" }) castellano_obs!: string;

    // ... Repite igual para sociales, biologia, ingles, quimica, fisica, matematicas,
    // emprendimiento, filosofia, etica_religion, informatica, ed_fisica, comportamiento

    // Ejemplo para sociales:
    @Column("float", { default: 0 }) sociales_corte1!: number;
    @Column("float", { default: 0 }) sociales_corte2!: number;
    @Column("float", { default: 0 }) sociales_corte3!: number;
    @Column("varchar", { default: "" }) sociales_desem1!: string;
    @Column("varchar", { default: "" }) sociales_desem2!: string;
    @Column("varchar", { default: "" }) sociales_desem3!: string;
    @Column("float", { default: 0 }) sociales_porcentual1!: number;
    @Column("float", { default: 0 }) sociales_porcentual2!: number;
    @Column("float", { default: 0 }) sociales_porcentual3!: number;
    @Column("float", { default: 0 }) sociales_def!: number;
    @Column("varchar", { default: "" }) sociales_obs!: string;

    // ...continúa con el resto de materias igual que en tu boletinDTO

    // Promedios y observaciones generales
    @Column("float", { default: 0 }) promedio_corte1!: number;
    @Column("float", { default: 0 }) promedio_corte2!: number;
    @Column("float", { default: 0 }) promedio_corte3!: number;

    @Column("text", { nullable: true }) obs!: string;
}