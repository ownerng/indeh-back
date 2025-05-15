import { Student } from "../../domain/entities/student";
import { StudentRepository } from "../../domain/repositories/StudentRepository";
import { CreateStudentDTO } from "../dtos/CreateStudentDTO";

export class CreateStudentUseCase {
    constructor(private studentRepository: StudentRepository) {}

    async execute(data: CreateStudentDTO): Promise<Student> {
        const student = new Student(
            crypto.randomUUID(),
            data.nombres_apellidos,
            data.tipo_documento,
            data.numero_documento,
            data.fecha_expedicion_documento,
            data.fecha_nacimiento,
            data.telefono,
            data.sexo,
            data.direccion,
            data.eps,
            data.tipo_sangre,
            data.email,
            data.estado,
            new Date(),
            data.subsidio,
            data.categoria,
            data.modalidad,
            data.grado,
            data.discapacidad,
            data.fecha_modificacion,
            data.nombres_apellidos_acudiente,
            data.numero_documento_acudiente,
            data.fecha_expedicion_documento_acudiente,
            data.telefono_acudiente,
            data.direccion_acudiente,
            data.contacto_emergencia,
            data.empresa_acudiente,
            data.nombres_apellidos_familiar1,
            data.numero_documento_familiar1,
            data.telefono_familiar1,
            data.parentesco_familiar1,
            data.empresa_familiar1,
            data.nombres_apellidos_familiar2,
            data.numero_documento_familiar2,
            data.telefono_familiar2,
            data.parentesco_familiar2,
            data.empresa_familiar2
        );
        return await this.studentRepository.createStudent(student);
    }
}

export class GetStudentByIdUseCase {
    constructor(private studentRepository: StudentRepository) {}

    async execute(id: string): Promise<Student | null> {
        const student = await this.studentRepository.getStudentById(id);
        if (!student) {
            throw new Error("Student not found");
        }
        return student;
    }
}

export class GetStudentByEmailUseCase {
    constructor(private studentRepository: StudentRepository) {}

    async execute(email: string): Promise<Student | null> {
        const student = await this.studentRepository.getStudentByEmail(email);
        if (!student) {
            throw new Error("Student not found");
        }
        return student;
    }
}

export class UpdateStudentUseCase {
    constructor(private studentRepository: StudentRepository) {}

    async execute(student: Student): Promise<Student> {
        return await this.studentRepository.updateStudent(student);
    }
}

export class GetAllStudentsUseCase {
    constructor(private studentRepository: StudentRepository) {}

    async execute(): Promise<Student[]> {
        return await this.studentRepository.getAllStudents();
    }
}