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

    async getAllSubjects(): Promise<(Omit<PgSubject, 'profesor'> & { profesor: Omit<PgUser, 'password'> })[]> {
        const subjects = await this.subjectRepository.find({
            relations: {
                profesor: true,
            },
        });

        return subjects.map(subject => {
            const { password, ...profesorWithoutPassword } = subject.profesor as PgUser;
            return {
                ...subject,
                profesor: profesorWithoutPassword,
            };
        });
    }

    async getSubjectById(id: number): Promise<(Omit<PgSubject, 'profesor'> & { profesor: Omit<PgUser, 'password'> }) | null> {
        const subject = await this.subjectRepository.findOne({
            where: { id },
            relations: { profesor: true },
        });

        if (!subject) {
            return null;
        }

        const { password, ...profesorWithoutPassword } = subject.profesor as PgUser;
        return {
            ...subject,
            profesor: profesorWithoutPassword,
        };
    }

    async getSubjectsIdsByProfessorId(professorId: number): Promise<{id: number; nombre: string}[]> {
        const subjects = await this.subjectRepository.find({
            where: {
                profesor: { id: professorId },
            },
            select: ["id", "nombre"],
        });
        return subjects.map(subject => ({
            id: subject.id,
            nombre: subject.nombre
        }));
    }

    private toPgSubject(subject: CreateSubjectDTO): PgSubject {
        const pgSubject = new PgSubject();
        pgSubject.nombre = subject.nombre;
        pgSubject.profesor = { id: subject.id_profesor } as PgUser;
        pgSubject.fecha_creacion = new Date();
        return pgSubject;
    }
}