import { AppDataSource } from "../config/data-source";
import { CreateStudentDTO } from "../dtos/createStudentDTO";
import { PgStudent } from "../entities/PgStudent";

export class StudentService {
    private studentRepository = AppDataSource.getRepository(PgStudent);
    

    async createStudent(studentData: CreateStudentDTO): Promise<PgStudent> {
        const student = this.studentRepository.create(this.toPgStudent(studentData));
        return await this.studentRepository.save(student);
    }

    async getAllStudents(): Promise<PgStudent[]> {
        return await this.studentRepository.find();
    }
    

    private toPgStudent(student: CreateStudentDTO): PgStudent {
    const pgStudent = new PgStudent();
    pgStudent.nombres_apellidos = student.nombres_apellidos;
    pgStudent.tipo_documento = student.tipo_documento;
    pgStudent.numero_documento = student.numero_documento;
    pgStudent.fecha_expedicion_documento = student.fecha_expedicion_documento;
    pgStudent.fecha_nacimiento = student.fecha_nacimiento;
    pgStudent.telefono = student.telefono;
    pgStudent.sexo = student.sexo;
    pgStudent.direccion = student.direccion;
    pgStudent.eps = student.eps;
    pgStudent.tipo_sangre = student.tipo_sangre;
    pgStudent.email = student.email;
    pgStudent.estado = student.estado;
    pgStudent.fecha_creacion = student.fecha_creacion;
    pgStudent.subsidio = student.subsidio;
    pgStudent.categoria = student.categoria;
    pgStudent.modalidad = student.modalidad;
    pgStudent.grado = student.grado;
    pgStudent.discapacidad = student.discapacidad;
    pgStudent.fecha_modificacion = student.fecha_modificacion;
    pgStudent.nombres_apellidos_acudiente = student.nombres_apellidos_acudiente;
    pgStudent.numero_documento_acudiente = student.numero_documento_acudiente;
    pgStudent.fecha_expedicion_documento_acudiente = student.fecha_expedicion_documento_acudiente;
    pgStudent.telefono_acudiente = student.telefono_acudiente;
    pgStudent.direccion_acudiente = student.direccion_acudiente;
    pgStudent.contacto_emergencia = student.contacto_emergencia;
    pgStudent.empresa_acudiente = student.empresa_acudiente;
    pgStudent.nombres_apellidos_familiar1 = student.nombres_apellidos_familiar1;
    pgStudent.numero_documento_familiar1 = student.numero_documento_familiar1;
    pgStudent.telefono_familiar1 = student.telefono_familiar1;
    pgStudent.parentesco_familiar1 = student.parentesco_familiar1;
    pgStudent.empresa_familiar1 = student.empresa_familiar1;
    pgStudent.nombres_apellidos_familiar2 = student.nombres_apellidos_familiar2;
    pgStudent.numero_documento_familiar2 = student.numero_documento_familiar2;
    pgStudent.telefono_familiar2 = student.telefono_familiar2;
    pgStudent.parentesco_familiar2 = student.parentesco_familiar2;
    pgStudent.empresa_familiar2 = student.empresa_familiar2;
    return pgStudent;
}
}