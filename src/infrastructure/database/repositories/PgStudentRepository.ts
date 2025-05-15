import { Student } from "../../../domain/entities/student";
import { StudentRepository } from "../../../domain/repositories/StudentRepository";
import { AppDataSource } from "../DataSource"; // Assuming DataSource.ts is in the parent directory
import { PgStudent } from "../models/PgStudent";

export class PgStudentRepository implements StudentRepository {
    private studentRepository = AppDataSource.getRepository(PgStudent);

    async createStudent(student: Student): Promise<Student> {
        const pgStudent = this.toPgEntity(student);
        const savedPgStudent = await this.studentRepository.save(pgStudent);
        return this.toDomainEntity(savedPgStudent);
    }

    async getAllStudents(): Promise<Student[]> {
        const pgStudents = await this.studentRepository.find();
        return pgStudents.map(this.toDomainEntity);
    }

    async getStudentById(id: string): Promise<Student | null> {
        const pgStudent = await this.studentRepository.findOne({ where: { id } });
        return pgStudent ? this.toDomainEntity(pgStudent) : null;
    }

    async getStudentByEmail(email: string): Promise<Student | null> {
        const pgStudent = await this.studentRepository.findOne({ where: { email } });
        return pgStudent ? this.toDomainEntity(pgStudent) : null;
    }

    async updateStudent(student: Student): Promise<Student> {
        const existingStudent = await this.studentRepository.findOne({ where: { id: student.id } });
        if (!existingStudent) {
            throw new Error(`Student with id ${student.id} not found.`);
        }

        const pgStudentToUpdate = this.toPgEntity(student);
        // Ensure fecha_creacion is not overwritten from the existing record if it shouldn't change
        // pgStudentToUpdate.fecha_creacion = existingStudent.fecha_creacion; // TypeORM @UpdateDateColumn handles fecha_modificacion

        const updatedPgStudent = await this.studentRepository.save(pgStudentToUpdate);
        return this.toDomainEntity(updatedPgStudent);
    }

    private toDomainEntity(pgStudent: PgStudent): Student {
        return new Student(
            pgStudent.id,
            pgStudent.nombres_apellidos,
            pgStudent.tipo_documento,
            pgStudent.numero_documento,
            pgStudent.fecha_expedicion_documento,
            pgStudent.fecha_nacimiento,
            pgStudent.telefono,
            pgStudent.sexo,
            pgStudent.direccion,
            pgStudent.eps,
            pgStudent.tipo_sangre,
            pgStudent.email,
            pgStudent.estado,
            pgStudent.fecha_creacion,
            pgStudent.subsidio,
            pgStudent.categoria,
            pgStudent.modalidad,
            pgStudent.grado,
            pgStudent.discapacidad,
            pgStudent.fecha_modificacion,
            pgStudent.nombres_apellidos_acudiente,
            pgStudent.numero_documento_acudiente,
            pgStudent.fecha_expedicion_documento_acudiente,
            pgStudent.telefono_acudiente,
            pgStudent.direccion_acudiente,
            pgStudent.contacto_emergencia,
            pgStudent.empresa_acudiente,
            pgStudent.nombres_apellidos_familiar1,
            pgStudent.numero_documento_familiar1,
            pgStudent.telefono_familiar1,
            pgStudent.parentesco_familiar1,
            pgStudent.empresa_familiar1,
            pgStudent.nombres_apellidos_familiar2,
            pgStudent.numero_documento_familiar2,
            pgStudent.telefono_familiar2,
            pgStudent.parentesco_familiar2,
            pgStudent.empresa_familiar2
        );
    }

    private toPgEntity(student: Student): PgStudent {
        const pgStudent = new PgStudent();
        pgStudent.id = student.id;
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
        pgStudent.fecha_creacion = student.fecha_creacion; // For creation, this is set from domain
        pgStudent.fecha_modificacion = student.fecha_modificacion; // For updates, @UpdateDateColumn will override this
        pgStudent.subsidio = student.subsidio;
        pgStudent.categoria = student.categoria;
        pgStudent.modalidad = student.modalidad;
        pgStudent.grado = student.grado;
        pgStudent.discapacidad = student.discapacidad;
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