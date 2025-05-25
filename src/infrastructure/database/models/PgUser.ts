import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserRole } from "../../../domain/entities/user";

@Entity("users")
export class PgUser {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column({ type: "varchar", length: 255, unique: true })
    username!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @Column({
        type: "enum",
        enum: UserRole,
        nullable: false, // Asegúrate que cada usuario tenga un rol
    })
    role!: UserRole;
}