import { AppDataSource } from "../config/data-source";
import { PgStudent } from "../entities/PgStudent";

export class StudentService {
    private studentRepository = AppDataSource.getRepository(PgStudent);
    

    async createStudent(studentData: PgStudent): Promise<PgStudent> {
        const student = this.studentRepository.create(studentData);
        return await this.studentRepository.save(student);
    }
    

    private toPgStudent(student: PgStudent): PgStudent {
        return {
            ...student
        }
    }
}