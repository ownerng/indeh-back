import { Anexo } from "../../../domain/entities/anexo";
import { AnexoRepository } from "../../../domain/repositories/AnexoRepository";
import { AppDataSource } from "../DataSource";
import { PgAnexo } from "../models/PgAnexo";
import { PgStudent } from "../models/PgStudent"; // Required for setting the relation

export class PgAnexoRepository implements AnexoRepository {
    private anexoRepository = AppDataSource.getRepository(PgAnexo);

    async createAnexo(anexo: Anexo): Promise<Anexo> {
        const pgAnexo = this.toPgEntity(anexo);
        const savedPgAnexo = await this.anexoRepository.save(pgAnexo);
        return this.toDomainEntity(savedPgAnexo);
    }

    async getAnexosByStudentId(studentId: string): Promise<Anexo[]> {
        const pgAnexos = await this.anexoRepository.find({
            where: { id_student: studentId },
        });
        return pgAnexos.map(this.toDomainEntity);
    }

    private toDomainEntity(pgAnexo: PgAnexo): Anexo {
        return new Anexo(
            pgAnexo.id,
            pgAnexo.id_student, // This comes directly from the PgAnexo's column
            pgAnexo.url,
            pgAnexo.fecha_creacion
        );
    }

    private toPgEntity(anexo: Anexo): PgAnexo {
        const pgAnexo = new PgAnexo();
        pgAnexo.id = anexo.id;
        pgAnexo.url = anexo.url;
        pgAnexo.fecha_creacion = anexo.fecha_creacion; // Domain entity provides this
        pgAnexo.student = { id: anexo.id_student } as PgStudent;

        return pgAnexo;
    }
}