import { AppDataSource } from "../config/data-source";
import { CreateSubjectDTO } from "../dtos/createSubjectDTO";
import { PgSubject } from "../entities/PgSubject";
import { PgUser } from "../entities/PgUser";

export class SubjectService {
    private subjectRepository = AppDataSource.getRepository(PgSubject);

    async createSubject(data: CreateSubjectDTO): Promise<PgSubject> {
        const newSubject = this.subjectRepository.create(this.toPgSubject(data));
        await this.subjectRepository.save(newSubject);
        return newSubject;
    }

    async getAllSubjects(): Promise<PgSubject[]> {
        return await this.subjectRepository.find({
            relations: {
                profesor: true,
            },
        });
    }

    private toPgSubject(subject: CreateSubjectDTO): PgSubject {
        const pgSubject = new PgSubject();
        pgSubject.nombre = subject.nombre;
        pgSubject.profesor = { id: subject.id_profesor } as PgUser;
        pgSubject.fecha_creacion = new Date();
        return pgSubject;
    }
}