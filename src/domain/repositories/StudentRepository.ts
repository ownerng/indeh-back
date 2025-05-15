import { Student } from "../entities/student";

export interface StudentRepository {
    createStudent(student: Student): Promise<Student>;
    getStudentById(id: string): Promise<Student | null>;
    getStudentByEmail(email: string): Promise<Student | null>;
    updateStudent(student: Student): Promise<Student>;
    getAllStudents(): Promise<Student[]>;
}