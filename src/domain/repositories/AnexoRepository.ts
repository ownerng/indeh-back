import { Anexo } from "../entities/anexo";

export interface AnexoRepository {
    createAnexo(anexo: Anexo): Promise<Anexo>;
    getAnexosByStudentId(studentId: string): Promise<Anexo[]>;
}