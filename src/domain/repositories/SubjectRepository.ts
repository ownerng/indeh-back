import { CreateSubjectDTO } from "../../app/dtos/CreateSubjectDTO";
import { Subject } from "../entities/subject";

export interface SubjectRepository {
    createSubject(subject: CreateSubjectDTO): Promise<Subject>;
    getAllSubjects(): Promise<Subject[]>;
}