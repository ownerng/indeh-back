import { Anexo } from "../../domain/entities/anexo";
import { AnexoRepository } from "../../domain/repositories/AnexoRepository";
import { CreateAnexoDTO } from "../dtos/CreateAnexoDTO";

export class CreateAnexoUseCase {
    constructor(private anexoRepository: AnexoRepository) {}

    async execute(data: CreateAnexoDTO): Promise<Anexo> {
        const anexo = new Anexo(
            crypto.randomUUID(),
            data.id_student,
            data.url,
            data.fecha_creacion,
        );
        return await this.anexoRepository.createAnexo(anexo);
    }
}

export class GetAnexosByStudentIdUseCase {
    constructor(private anexoRepository: AnexoRepository) {}

    async execute(studentId: string): Promise<Anexo[]> {
        const anexos = await this.anexoRepository.getAnexosByStudentId(studentId);
        if (!anexos || anexos.length === 0) {
            throw new Error("No anexos found for this student");
        }
        return anexos;
    }
}