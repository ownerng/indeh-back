import { In } from "typeorm";
import { Calification } from "../../../domain/entities/calification";
import { CalificationRepository } from "../../../domain/repositories/CalificationRepository";
import { AppDataSource } from "../DataSource";
import { PgCalification } from "../models/PgCalification";
import { PgStudent } from "../models/PgStudent"; // Required for setting relation
import { PgSubject } from "../models/PgSubject"; // Required for setting relation

export class PgCalificationRepository implements CalificationRepository {
    private calificationRepository = AppDataSource.getRepository(PgCalification);

    async createCorte1(calification: Calification): Promise<Calification> {
        const pgCalification = this.toPgEntity(calification);
        const savedCalification = await this.calificationRepository.save(pgCalification);
        return this.toDomainEntity(savedCalification);
    }

    async createCorte2(calification: Calification): Promise<Calification> {
        const pgCalification = this.toPgEntity(calification);
        const savedCalification = await this.calificationRepository.save(pgCalification);
        return this.toDomainEntity(savedCalification);
    }
    async createCorte3(calification: Calification): Promise<Calification> {
        const pgCalification = this.toPgEntity(calification);
        const savedCalification = await this.calificationRepository.save(pgCalification);
        return this.toDomainEntity(savedCalification);
    }

    async getCalificationByStudentId(studentId: string): Promise<Calification[]> {
        const pgCalifications = await this.calificationRepository.find({
            where: { id_student: studentId },
            relations: ["student", "subject"],
        });

        return pgCalifications.map((pgCalification) => this.toDomainEntity(pgCalification));
    }

    private toDomainEntity(pgCalification: PgCalification): Calification {
        return new Calification(
            pgCalification.id,
            pgCalification.id_student,
            pgCalification.id_subject,
            pgCalification.corte1,
            pgCalification.corte2,
            pgCalification.corte3,
            pgCalification.definitiva,
            pgCalification.fecha_creacion,
            pgCalification.fecha_modificacion
        );
    }

    private toPgEntity(calification: Calification): PgCalification {
        const pgCalification = new PgCalification();
        pgCalification.id = calification.id;
        pgCalification.corte1 = calification.corte1;
        pgCalification.corte2 = calification.corte2;
        pgCalification.corte3 = calification.corte3;
        pgCalification.definitiva = calification.definitiva;
        pgCalification.fecha_creacion = calification.fecha_creacion;
        pgCalification.fecha_modificacion = calification.fecha_modificacion;
        pgCalification.student = { id: calification.id_student } as PgStudent;
        pgCalification.subject = { id: calification.id_subject } as PgSubject;
        return pgCalification;
    }
}