import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { PgCalification } from "./PgCalification"; // Make sure PgCalification.ts is in the same directory or path is updated

@Entity("students")
export class PgStudent {
    @PrimaryColumn({type: "uuid"})
    id!: string;

    @Column({ type: "varchar", length: 255 })
    nombres_apellidos!: string;

    @Column({ type: "enum", enum: ["CC", "TI"] })
    tipo_documento!: "CC" | "TI";

    @Column({ type: "varchar", length: 50, unique: true })
    numero_documento!: string;

    @Column({ type: "date" })
    fecha_expedicion_documento!: Date;

    @Column({ type: "date" })
    fecha_nacimiento!: Date;

    @Column({ type: "varchar", length: 20 })
    telefono!: string;

    @Column({ type: "enum", enum: ["M", "F"] })
    sexo!: "M" | "F";

    @Column({ type: "varchar", length: 255 })
    direccion!: string;

    @Column({ type: "varchar", length: 100 })
    eps!: string;

    @Column({ type: "enum", enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] })
    tipo_sangre!: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ type: "enum", enum: ["Activo", "Inactivo"], default: "Activo" })
    estado!: "Activo" | "Inactivo";

    @CreateDateColumn()
    fecha_creacion!: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    subsidio!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    categoria!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    modalidad!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    grado!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    discapacidad!: string;

    @UpdateDateColumn()
    fecha_modificacion!: Date;

    @Column({ type: "varchar", length: 255 })
    nombres_apellidos_acudiente!: string;

    @Column({ type: "varchar", length: 50 })
    numero_documento_acudiente!: string;

    @Column({ type: "date" , nullable: true})
    fecha_expedicion_documento_acudiente!: Date;

    @Column({ type: "varchar", length: 20 })
    telefono_acudiente!: string;

    @Column({ type: "varchar", length: 255 })
    direccion_acudiente!: string;

    @Column({ type: "varchar", length: 255 })
    contacto_emergencia!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    empresa_acudiente!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    nombres_apellidos_familiar1!: string | null;

    @Column({ type: "varchar", length: 50, nullable: true })
    numero_documento_familiar1!: string | null;

    @Column({ type: "varchar", length: 20, nullable: true })
    telefono_familiar1!: string | null;

    @Column({ type: "varchar", length: 100, nullable: true })
    parentesco_familiar1!: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    empresa_familiar1!: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    nombres_apellidos_familiar2!: string | null;

    @Column({ type: "varchar", length: 50, nullable: true })
    numero_documento_familiar2!: string | null;

    @Column({ type: "varchar", length: 20, nullable: true })
    telefono_familiar2!: string | null;

    @Column({ type: "varchar", length: 100, nullable: true })
    parentesco_familiar2!: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    empresa_familiar2!: string | null;

    @OneToMany(() => PgCalification, (calification) => calification.student)
    califications!: PgCalification[];
}