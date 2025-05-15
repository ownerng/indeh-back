import { Subject } from "../entities/subject";

export interface SubjectRepository {
    createSubject(subject: Subject): Promise<Subject>;
    getAllSubjects(): Promise<Subject[]>;
}