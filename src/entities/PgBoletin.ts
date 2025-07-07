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

    @ManyToOne(() => PgStudent, (user) => user.id, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "id_student" })
    id_student!: PgStudent;

    @CreateDateColumn()
    fecha_creacion!: Date;

    @Column()
    state!: string;

    @Column()
    puesto!: number;

    // Castellano
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

    // Sociales
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

    // Biología
    @Column("float", { default: 0 }) biologia_corte1!: number;
    @Column("float", { default: 0 }) biologia_corte2!: number;
    @Column("float", { default: 0 }) biologia_corte3!: number;
    @Column("varchar", { default: "" }) biologia_desem1!: string;
    @Column("varchar", { default: "" }) biologia_desem2!: string;
    @Column("varchar", { default: "" }) biologia_desem3!: string;
    @Column("float", { default: 0 }) biologia_porcentual1!: number;
    @Column("float", { default: 0 }) biologia_porcentual2!: number;
    @Column("float", { default: 0 }) biologia_porcentual3!: number;
    @Column("float", { default: 0 }) biologia_def!: number;
    @Column("varchar", { default: "" }) biologia_obs!: string;

    // Inglés
    @Column("float", { default: 0 }) ingles_corte1!: number;
    @Column("float", { default: 0 }) ingles_corte2!: number;
    @Column("float", { default: 0 }) ingles_corte3!: number;
    @Column("varchar", { default: "" }) ingles_desem1!: string;
    @Column("varchar", { default: "" }) ingles_desem2!: string;
    @Column("varchar", { default: "" }) ingles_desem3!: string;
    @Column("float", { default: 0 }) ingles_porcentual1!: number;
    @Column("float", { default: 0 }) ingles_porcentual2!: number;
    @Column("float", { default: 0 }) ingles_porcentual3!: number;
    @Column("float", { default: 0 }) ingles_def!: number;
    @Column("varchar", { default: "" }) ingles_obs!: string;

    // Química
    @Column("float", { default: 0 }) quimica_corte1!: number;
    @Column("float", { default: 0 }) quimica_corte2!: number;
    @Column("float", { default: 0 }) quimica_corte3!: number;
    @Column("varchar", { default: "" }) quimica_desem1!: string;
    @Column("varchar", { default: "" }) quimica_desem2!: string;
    @Column("varchar", { default: "" }) quimica_desem3!: string;
    @Column("float", { default: 0 }) quimica_porcentual1!: number;
    @Column("float", { default: 0 }) quimica_porcentual2!: number;
    @Column("float", { default: 0 }) quimica_porcentual3!: number;
    @Column("float", { default: 0 }) quimica_def!: number;
    @Column("varchar", { default: "" }) quimica_obs!: string;

    // Física
    @Column("float", { default: 0 }) fisica_corte1!: number;
    @Column("float", { default: 0 }) fisica_corte2!: number;
    @Column("float", { default: 0 }) fisica_corte3!: number;
    @Column("varchar", { default: "" }) fisica_desem1!: string;
    @Column("varchar", { default: "" }) fisica_desem2!: string;
    @Column("varchar", { default: "" }) fisica_desem3!: string;
    @Column("float", { default: 0 }) fisica_porcentual1!: number;
    @Column("float", { default: 0 }) fisica_porcentual2!: number;
    @Column("float", { default: 0 }) fisica_porcentual3!: number;
    @Column("float", { default: 0 }) fisica_def!: number;
    @Column("varchar", { default: "" }) fisica_obs!: string;

    // Matemáticas
    @Column("float", { default: 0 }) matematicas_corte1!: number;
    @Column("float", { default: 0 }) matematicas_corte2!: number;
    @Column("float", { default: 0 }) matematicas_corte3!: number;
    @Column("varchar", { default: "" }) matematicas_desem1!: string;
    @Column("varchar", { default: "" }) matematicas_desem2!: string;
    @Column("varchar", { default: "" }) matematicas_desem3!: string;
    @Column("float", { default: 0 }) matematicas_porcentual1!: number;
    @Column("float", { default: 0 }) matematicas_porcentual2!: number;
    @Column("float", { default: 0 }) matematicas_porcentual3!: number;
    @Column("float", { default: 0 }) matematicas_def!: number;
    @Column("varchar", { default: "" }) matematicas_obs!: string;

    // Emprendimiento
    @Column("float", { default: 0 }) emprendimiento_corte1!: number;
    @Column("float", { default: 0 }) emprendimiento_corte2!: number;
    @Column("float", { default: 0 }) emprendimiento_corte3!: number;
    @Column("varchar", { default: "" }) emprendimiento_desem1!: string;
    @Column("varchar", { default: "" }) emprendimiento_desem2!: string;
    @Column("varchar", { default: "" }) emprendimiento_desem3!: string;
    @Column("float", { default: 0 }) emprendimiento_porcentual1!: number;
    @Column("float", { default: 0 }) emprendimiento_porcentual2!: number;
    @Column("float", { default: 0 }) emprendimiento_porcentual3!: number;
    @Column("float", { default: 0 }) emprendimiento_def!: number;
    @Column("varchar", { default: "" }) emprendimiento_obs!: string;

    // Filosofía
    @Column("float", { default: 0 }) filosofia_corte1!: number;
    @Column("float", { default: 0 }) filosofia_corte2!: number;
    @Column("float", { default: 0 }) filosofia_corte3!: number;
    @Column("varchar", { default: "" }) filosofia_desem1!: string;
    @Column("varchar", { default: "" }) filosofia_desem2!: string;
    @Column("varchar", { default: "" }) filosofia_desem3!: string;
    @Column("float", { default: 0 }) filosofia_porcentual1!: number;
    @Column("float", { default: 0 }) filosofia_porcentual2!: number;
    @Column("float", { default: 0 }) filosofia_porcentual3!: number;
    @Column("float", { default: 0 }) filosofia_def!: number;
    @Column("varchar", { default: "" }) filosofia_obs!: string;

    // Ética y religión
    @Column("float", { default: 0 }) etica_religion_corte1!: number;
    @Column("float", { default: 0 }) etica_religion_corte2!: number;
    @Column("float", { default: 0 }) etica_religion_corte3!: number;
    @Column("varchar", { default: "" }) etica_religion_desem1!: string;
    @Column("varchar", { default: "" }) etica_religion_desem2!: string;
    @Column("varchar", { default: "" }) etica_religion_desem3!: string;
    @Column("float", { default: 0 }) etica_religion_porcentual1!: number;
    @Column("float", { default: 0 }) etica_religion_porcentual2!: number;
    @Column("float", { default: 0 }) etica_religion_porcentual3!: number;
    @Column("float", { default: 0 }) etica_religion_def!: number;
    @Column("varchar", { default: "" }) etica_religion_obs!: string;

    // Informática
    @Column("float", { default: 0 }) informatica_corte1!: number;
    @Column("float", { default: 0 }) informatica_corte2!: number;
    @Column("float", { default: 0 }) informatica_corte3!: number;
    @Column("varchar", { default: "" }) informatica_desem1!: string;
    @Column("varchar", { default: "" }) informatica_desem2!: string;
    @Column("varchar", { default: "" }) informatica_desem3!: string;
    @Column("float", { default: 0 }) informatica_porcentual1!: number;
    @Column("float", { default: 0 }) informatica_porcentual2!: number;
    @Column("float", { default: 0 }) informatica_porcentual3!: number;
    @Column("float", { default: 0 }) informatica_def!: number;
    @Column("varchar", { default: "" }) informatica_obs!: string;

    // Educación física
    @Column("float", { default: 0 }) ed_fisica_corte1!: number;
    @Column("float", { default: 0 }) ed_fisica_corte2!: number;
    @Column("float", { default: 0 }) ed_fisica_corte3!: number;
    @Column("varchar", { default: "" }) ed_fisica_desem1!: string;
    @Column("varchar", { default: "" }) ed_fisica_desem2!: string;
    @Column("varchar", { default: "" }) ed_fisica_desem3!: string;
    @Column("float", { default: 0 }) ed_fisica_porcentual1!: number;
    @Column("float", { default: 0 }) ed_fisica_porcentual2!: number;
    @Column("float", { default: 0 }) ed_fisica_porcentual3!: number;
    @Column("float", { default: 0 }) ed_fisica_def!: number;
    @Column("varchar", { default: "" }) ed_fisica_obs!: string;

    // Comportamiento
    @Column("float", { default: 0 }) comportamiento_corte1!: number;
    @Column("float", { default: 0 }) comportamiento_corte2!: number;
    @Column("float", { default: 0 }) comportamiento_corte3!: number;
    @Column("varchar", { default: "" }) comportamiento_desem1!: string;
    @Column("varchar", { default: "" }) comportamiento_desem2!: string;
    @Column("varchar", { default: "" }) comportamiento_desem3!: string;
    @Column("float", { default: 0 }) comportamiento_porcentual1!: number;
    @Column("float", { default: 0 }) comportamiento_porcentual2!: number;
    @Column("float", { default: 0 }) comportamiento_porcentual3!: number;
    @Column("float", { default: 0 }) comportamiento_def!: number;
    @Column("varchar", { default: "" }) comportamiento_obs!: string;

    // Promedios y observaciones generales
    @Column("float", { default: 0 }) promedio_corte1!: number;
    @Column("float", { default: 0 }) promedio_corte2!: number;
    @Column("float", { default: 0 }) promedio_corte3!: number;

    @Column("text", { nullable: true }) obs!: string;
}