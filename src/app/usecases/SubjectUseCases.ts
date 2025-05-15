import { Subject } from "../../domain/entities/subject";
import { SubjectRepository } from "../../domain/repositories/SubjectRepository";

export class CreateSubjectUseCase {
    constructor(private subjectRepository: SubjectRepository) {}

    async execute(subject: Subject): Promise<Subject> {
        return await this.subjectRepository.createSubject(subject);
    }
}

export class GetAllSubjectsUseCase {
    constructor(private subjectRepository: SubjectRepository) {}

    async execute(): Promise<Subject[]> {
        const subjects = await this.subjectRepository.getAllSubjects();
        if (!subjects || subjects.length === 0) {
            throw new Error("No subjects found");
        }
        return subjects;
    }
}
