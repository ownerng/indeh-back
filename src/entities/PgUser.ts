import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserRole } from "./UserRole";

@Entity("users") // Nombre de la tabla en la base de datos
export class PgUser {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  username!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password!: string; // Se almacenará hasheada

  @Column({
    type: "enum",
    enum: UserRole,
    nullable: false,
  })
  role!: UserRole;
}