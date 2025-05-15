import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class PgUser {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column({ type: "varchar", length: 255, unique: true })
    username!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;
}