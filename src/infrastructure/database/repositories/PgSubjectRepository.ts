import { Subject } from "../../../domain/entities/subject";
import { SubjectRepository } from "../../../domain/repositories/SubjectRepository";
import { AppDataSource } from "../DataSource";
import { PgSubject } from "../models/PgSubject";

export class PgSubjectRepository implements SubjectRepository {

    private subjectRepository = AppDataSource.getRepository(PgSubject);

    async createSubject(subject: Subject): Promise<Subject> {
        const pgSubject = this.toPgEntity(subject);
        const savedPgSubject = await this.subjectRepository.save(pgSubject);
        return this.toDomainEntity(savedPgSubject);
    }

     async getAllSubjects(): Promise<Subject[]> {
        const pgSubjects = await this.subjectRepository.find();
        return pgSubjects.map(this.toDomainEntity);
    }
    

    // Add other methods from SubjectRepository if they exist, e.g.:
    // async getSubjectById(id: string): Promise<Subject | null> {
    //     const pgSubject = await this.subjectRepository.findOne({ where: { id } });
    //     return pgSubject ? this.toDomainEntity(pgSubject) : null;
    // }

    // async updateSubject(subject: Subject): Promise<Subject> {
    //     const existingSubject = await this.subjectRepository.findOne({ where: { id: subject.id } });
    //     if (!existingSubject) {
    //         throw new Error(`Subject with id ${subject.id} not found.`);
    //     }
    //     const pgSubjectToUpdate = this.toPgEntity(subject);
    //     const updatedPgSubject = await this.subjectRepository.save(pgSubjectToUpdate);
    //     return this.toDomainEntity(updatedPgSubject);
    // }

    // async getAllSubjects(): Promise<Subject[]> {
    //     const pgSubjects = await this.subjectRepository.find();
    //     return pgSubjects.map(this.toDomainEntity);
    // }

    private toDomainEntity(pgSubject: PgSubject): Subject {
        return new Subject(
            pgSubject.id,
            pgSubject.nombre,
            pgSubject.estado,
            pgSubject.fecha_creacion,
            pgSubject.fecha_modificacion
        );
    }

    private toPgEntity(subject: Subject): PgSubject {
        const pgSubject = new PgSubject();
        pgSubject.id = subject.id;
        pgSubject.nombre = subject.nombre;
        pgSubject.estado = subject.estado;
        pgSubject.fecha_creacion = subject.fecha_creacion; // For creation
        pgSubject.fecha_modificacion = subject.fecha_modificacion; // For updates, @UpdateDateColumn will manage this
        return pgSubject;
    }
}