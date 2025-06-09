import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { CreateStudentDTO } from "../dtos/createStudentDTO";
import { PgStudent } from "../entities/PgStudent";
import { ScoreService } from "./score.service";
import { SubjectService } from "./subject.service";
import { boletinDTO } from "../dtos/boletinDTO";
import { ciclo, porcentual, desem } from "../utils/utils";
import { PgSubject } from "../entities/PgSubject";
import { PgScore } from "../entities/PgScore";

export class StudentService {
    private studentRepository = AppDataSource.getRepository(PgStudent);


    async createStudent(studentData: CreateStudentDTO): Promise<PgStudent> {
        const student = this.studentRepository.create(this.toPgStudent(studentData));
        return await this.studentRepository.save(student);
    }

    async getAllStudents(): Promise<PgStudent[]> {
        return await this.studentRepository.find();
    }

    async getStudentById(id: number): Promise<PgStudent | null> {
        const student = await this.studentRepository.findOneBy({ id: id });
        if (!student) {
            return null;
        }
        return student;
    }

    async deleteStudentById(id: number): Promise<PgStudent | null> {
        const student = await this.studentRepository.findOneBy({ id: id });
        if (!student) {
            return null;
        }
        return await this.studentRepository.remove(student);

    }

    async updateStudents(studentId: number, studentData: CreateStudentDTO): Promise<PgStudent | null> {
        const student = await this.studentRepository.findOneBy({ id: studentId });
        if (!student) {
            return null;
        }
        student.nombres_apellidos = studentData.nombres_apellidos;
        student.tipo_documento = studentData.tipo_documento;
        student.numero_documento = studentData.numero_documento;
        student.fecha_expedicion_documento = studentData.fecha_expedicion_documento;
        student.fecha_nacimiento = studentData.fecha_nacimiento;
        student.telefono = studentData.telefono;
        student.sexo = studentData.sexo;
        student.direccion = studentData.direccion;
        student.eps = studentData.eps;
        student.tipo_sangre = studentData.tipo_sangre;
        student.email = studentData.email;
        student.estado = studentData.estado;
        student.fecha_creacion = studentData.fecha_creacion;
        student.subsidio = studentData.subsidio;
        student.categoria = studentData.categoria;
        student.modalidad = studentData.modalidad;
        student.grado = studentData.grado;
        student.discapacidad = studentData.discapacidad;
        student.fecha_modificacion = studentData.fecha_modificacion;
        student.nombres_apellidos_acudiente = studentData.nombres_apellidos_acudiente;
        student.numero_documento_acudiente = studentData.numero_documento_acudiente;
        student.fecha_expedicion_documento_acudiente = studentData.fecha_expedicion_documento_acudiente;
        student.telefono_acudiente = studentData.telefono_acudiente;
        student.direccion_acudiente = studentData.direccion_acudiente;
        student.contacto_emergencia = studentData.contacto_emergencia;
        student.empresa_acudiente = studentData.empresa_acudiente;
        student.nombres_apellidos_familiar1 = studentData.nombres_apellidos_familiar1;
        student.numero_documento_familiar1 = studentData.numero_documento_familiar1;
        student.telefono_familiar1 = studentData.telefono_familiar1;
        student.parentesco_familiar1 = studentData.parentesco_familiar1;
        student.empresa_familiar1 = studentData.empresa_familiar1;
        student.nombres_apellidos_familiar2 = studentData.nombres_apellidos_familiar2;
        student.numero_documento_familiar2 = studentData.numero_documento_familiar2;
        student.telefono_familiar2 = studentData.telefono_familiar2;
        student.parentesco_familiar2 = studentData.parentesco_familiar2;
        student.empresa_familiar2 = studentData.empresa_familiar2;
        return await this.studentRepository.save(student);
    }

    async getBoletinByStudentId(studentId: number): Promise<boletinDTO | null> {
        const scores:PgScore[] = await new ScoreService().getScoresByStudentId(studentId);
        if (scores.length === 0) {
            return null;
        }

        const student = await this.studentRepository.findOne({ where: { id: studentId } });
        if (!student) return null;

        const boletin: boletinDTO = {
            fecha_creacion: new Date().toLocaleDateString(),
            nombres_apellidos: student.nombres_apellidos,
            grado: student.grado,
            ciclo: ciclo(student.grado),
            jornada: student.modalidad,
            castellano_corte1: 0,
            castellano_corte2: 0,
            castellano_corte3: 0,
            castellano_desem1: '',
            castellano_desem2: '',
            castellano_desem3: '',
            castellano_porcentual1: 0,
            castellano_porcentual2: 0,
            castellano_porcentual3: 0,
            castellano_def: 0,
            ingles_corte1: 0,
            ingles_corte2: 0,
            ingles_corte3: 0,
            ingles_desem1: '',
            ingles_desem2: '',
            ingles_desem3: '',
            ingles_porcentual1: 0,
            ingles_porcentual2: 0,
            ingles_porcentual3: 0,
            ingles_def: 0,
            quimica_corte1: 0,
            quimica_corte2: 0,
            quimica_corte3: 0,
            quimica_desem1: '',
            quimica_desem2: '',
            quimica_desem3: '',
            quimica_porcentual1: 0,
            quimica_porcentual2: 0,
            quimica_porcentual3: 0,
            quimica_def: 0,
            fisica_corte1: 0,
            fisica_corte2: 0,
            fisica_corte3: 0,
            fisica_desem1: '',
            fisica_desem2: '',
            fisica_desem3: '',
            fisica_porcentual1: 0,
            fisica_porcentual2: 0,
            fisica_porcentual3: 0,
            fisica_def: 0,
            matematicas_corte1: 0,
            matematicas_corte2: 0,
            matematicas_corte3: 0,
            matematicas_desem1: '',
            matematicas_desem2: '',
            matematicas_desem3: '',
            matematicas_porcentual1: 0,
            matematicas_porcentual2: 0,
            matematicas_porcentual3: 0,
            matematicas_def: 0,
            emprendimiento_corte1: 0,
            emprendimiento_corte2: 0,
            emprendimiento_corte3: 0,
            emprendimiento_desem1: '',
            emprendimiento_desem2: '',
            emprendimiento_desem3: '',
            emprendimiento_porcentual1: 0,
            emprendimiento_porcentual2: 0,
            emprendimiento_porcentual3: 0,
            emprendimiento_def: 0,
            filosofia_corte1: 0,
            filosofia_corte2: 0,
            filosofia_corte3: 0,
            filosofia_desem1: '',
            filosofia_desem2: '',
            filosofia_desem3: '',
            filosofia_porcentual1: 0,
            filosofia_porcentual2: 0,
            filosofia_porcentual3: 0,
            filosofia_def: 0,
            etica_religion_corte1: 0,
            etica_religion_corte2: 0,
            etica_religion_corte3: 0,
            etica_religion_desem1: '',
            etica_religion_desem2: '',
            etica_religion_desem3: '',
            etica_religion_porcentual1: 0,
            etica_religion_porcentual2: 0,
            etica_religion_porcentual3: 0,
            etica_religion_def: 0,
            informatica_corte1: 0,
            informatica_corte2: 0,
            informatica_corte3: 0,
            informatica_desem1: '',
            informatica_desem2: '',
            informatica_desem3: '',
            informatica_porcentual1: 0,
            informatica_porcentual2: 0,
            informatica_porcentual3: 0,
            informatica_def: 0,
            ed_fisica_corte1: 0,
            ed_fisica_corte2: 0,
            ed_fisica_corte3: 0,
            ed_fisica_desem1: '',
            ed_fisica_desem2: '',
            ed_fisica_desem3: '',
            ed_fisica_porcentual1: 0,
            ed_fisica_porcentual2: 0,
            ed_fisica_porcentual3: 0,
            ed_fisica_def: 0,
            comportamiento_corte1: 0,
            comportamiento_corte2: 0,
            comportamiento_corte3: 0,
            comportamiento_desem1: '',
            comportamiento_desem2: '',
            comportamiento_desem3: '',
            comportamiento_porcentual1: 0,
            comportamiento_porcentual2: 0,
            comportamiento_porcentual3: 0,
            comportamiento_def: 0,
            promedio_corte1: 0,
            promedio_corte2: 0,
            promedio_corte3: 0,
        };

        // Procesa cada score y llena el boletin
        for (const score of scores) {
            const subject = await new SubjectService().getSubjectById( score.id_subject.id);
            if (!subject) continue;

            const nombre = subject.nombre.toLowerCase();

            if (nombre === "castellano") {
                boletin.castellano_corte1 = score.corte1 ?? 0;
                boletin.castellano_corte2 = score.corte2 ?? 0;
                boletin.castellano_corte3 = score.corte3 ?? 0;
                boletin.castellano_def = score.notadefinitiva ?? 0;

                boletin.castellano_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.castellano_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.castellano_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.castellano_desem1 = desem(score.corte1 ?? 0);
                boletin.castellano_desem2 = desem(score.corte2 ?? 0);
                boletin.castellano_desem3 = desem(score.corte3 ?? 0);
            } else if (nombre === "ingles") {
                boletin.ingles_corte1 = score.corte1 ?? 0;
                boletin.ingles_corte2 = score.corte2 ?? 0;
                boletin.ingles_corte3 = score.corte3 ?? 0;
                boletin.ingles_def = score.notadefinitiva ?? 0;

                boletin.ingles_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.ingles_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.ingles_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.ingles_desem1 = desem(score.corte1 ?? 0);
                boletin.ingles_desem2 = desem(score.corte2 ?? 0);
                boletin.ingles_desem3 = desem(score.corte3 ?? 0);
            } else if (nombre === "quimica") {
                boletin.quimica_corte1 = score.corte1 ?? 0;
                boletin.quimica_corte2 = score.corte2 ?? 0;
                boletin.quimica_corte3 = score.corte3 ?? 0;
                boletin.quimica_def = score.notadefinitiva ?? 0;

                boletin.quimica_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.quimica_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.quimica_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.quimica_desem1 = desem(score.corte1 ?? 0);
                boletin.quimica_desem2 = desem(score.corte2 ?? 0);
                boletin.quimica_desem3 = desem(score.corte3 ?? 0);
            } else if (nombre === "fisica") {
                boletin.fisica_corte1 = score.corte1 ?? 0;
                boletin.fisica_corte2 = score.corte2 ?? 0;
                boletin.fisica_corte3 = score.corte3 ?? 0;
                boletin.fisica_def = score.notadefinitiva ?? 0;

                boletin.fisica_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.fisica_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.fisica_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.fisica_desem1 = desem(score.corte1 ?? 0);
                boletin.fisica_desem2 = desem(score.corte2 ?? 0);
                boletin.fisica_desem3 = desem(score.corte3 ?? 0);
            } else if (nombre === "matematicas") {
                boletin.matematicas_corte1 = score.corte1 ?? 0;
                boletin.matematicas_corte2 = score.corte2 ?? 0;
                boletin.matematicas_corte3 = score.corte3 ?? 0;
                boletin.matematicas_def = score.notadefinitiva ?? 0;

                boletin.matematicas_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.matematicas_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.matematicas_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.matematicas_desem1 = desem(score.corte1 ?? 0);
                boletin.matematicas_desem2 = desem(score.corte2 ?? 0);
                boletin.matematicas_desem3 = desem(score.corte3 ?? 0);
            } else if (nombre === "emprendimiento") {
                boletin.emprendimiento_corte1 = score.corte1 ?? 0;
                boletin.emprendimiento_corte2 = score.corte2 ?? 0;
                boletin.emprendimiento_corte3 = score.corte3 ?? 0;
                boletin.emprendimiento_def = score.notadefinitiva ?? 0;

                boletin.emprendimiento_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.emprendimiento_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.emprendimiento_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.emprendimiento_desem1 = desem(score.corte1 ?? 0);
                boletin.emprendimiento_desem2 = desem(score.corte2 ?? 0);
                boletin.emprendimiento_desem3 = desem(score.corte3 ?? 0);

            } else if (nombre === "filosofia") {
                boletin.emprendimiento_corte1 = score.corte1 ?? 0;
                boletin.emprendimiento_corte2 = score.corte2 ?? 0;
                boletin.emprendimiento_corte3 = score.corte3 ?? 0;
                boletin.emprendimiento_def = score.notadefinitiva ?? 0;

                boletin.emprendimiento_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.emprendimiento_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.emprendimiento_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.emprendimiento_desem1 = desem(score.corte1 ?? 0);
                boletin.emprendimiento_desem2 = desem(score.corte2 ?? 0);
                boletin.emprendimiento_desem3 = desem(score.corte3 ?? 0);
            }
            else if (nombre === "etica y religion" || nombre === "etica_religion") {
                boletin.etica_religion_corte1 = score.corte1 ?? 0;
                boletin.etica_religion_corte2 = score.corte2 ?? 0;
                boletin.etica_religion_corte3 = score.corte3 ?? 0;
                boletin.etica_religion_def = score.notadefinitiva ?? 0;

                boletin.etica_religion_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.etica_religion_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.etica_religion_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.etica_religion_desem1 = desem(score.corte1 ?? 0);
                boletin.etica_religion_desem2 = desem(score.corte2 ?? 0);
                boletin.etica_religion_desem3 = desem(score.corte3 ?? 0);
            } else if (nombre === "informatica") {
                boletin.informatica_corte1 = score.corte1 ?? 0;
                boletin.informatica_corte2 = score.corte2 ?? 0;
                boletin.informatica_corte3 = score.corte3 ?? 0;
                boletin.informatica_def = score.notadefinitiva ?? 0;

                boletin.informatica_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.informatica_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.informatica_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.informatica_desem1 = desem(score.corte1 ?? 0);
                boletin.informatica_desem2 = desem(score.corte2 ?? 0);
                boletin.informatica_desem3 = desem(score.corte3 ?? 0);
            } else if (nombre === "educacion fisica" || nombre === "ed_fisica") {
                boletin.ed_fisica_corte1 = score.corte1 ?? 0;
                boletin.ed_fisica_corte2 = score.corte2 ?? 0;
                boletin.ed_fisica_corte3 = score.corte3 ?? 0;
                boletin.ed_fisica_def = score.notadefinitiva ?? 0;

                boletin.ed_fisica_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.ed_fisica_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.ed_fisica_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.ed_fisica_desem1 = desem(score.corte1 ?? 0);
                boletin.ed_fisica_desem2 = desem(score.corte2 ?? 0);
                boletin.ed_fisica_desem3 = desem(score.corte3 ?? 0);
            } else if (nombre === "comportamiento") {
                boletin.comportamiento_corte1 = score.corte1 ?? 0;
                boletin.comportamiento_corte2 = score.corte2 ?? 0;
                boletin.comportamiento_corte3 = score.corte3 ?? 0;
                boletin.comportamiento_def = score.notadefinitiva ?? 0;

                boletin.comportamiento_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.comportamiento_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.comportamiento_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.comportamiento_desem1 = desem(score.corte1 ?? 0);
                boletin.comportamiento_desem2 = desem(score.corte2 ?? 0);
                boletin.comportamiento_desem3 = desem(score.corte3 ?? 0);
            }
        }

        // Calcular promedios finales por corte, excluyendo la nota de comportamiento
        const materiasParaPromedio = [
            'castellano', 'ingles', 'quimica', 'fisica', 'matematicas',
            'emprendimiento', 'etica_religion', 'informatica', 'ed_fisica' // 'comportamiento' ha sido excluido
        ] as const;

        type Materia = typeof materiasParaPromedio[number];
        type CorteKey = `${Materia}_corte1` | `${Materia}_corte2` | `${Materia}_corte3`;

        let sumCorte1 = 0;
        let countCorte1 = 0;
        let sumCorte2 = 0;
        let countCorte2 = 0;
        let sumCorte3 = 0;
        let countCorte3 = 0;

        for (const materia of materiasParaPromedio) {
            const corte1Key = `${materia}_corte1` as CorteKey;
            const corte2Key = `${materia}_corte2` as CorteKey;
            const corte3Key = `${materia}_corte3` as CorteKey;

            if ((boletin as any)[corte1Key] > 0) {
                sumCorte1 += (boletin as any)[corte1Key];
                countCorte1++;
            }
            if ((boletin as any)[corte2Key] > 0) {
                sumCorte2 += (boletin as any)[corte2Key];
                countCorte2++;
            }
            if ((boletin as any)[corte3Key] > 0) {
                sumCorte3 += (boletin as any)[corte3Key];
                countCorte3++;
            }
        }

        boletin.promedio_corte1 = countCorte1 > 0 ? sumCorte1 / countCorte1 : 0;
        boletin.promedio_corte2 = countCorte2 > 0 ? sumCorte2 / countCorte2 : 0;
        boletin.promedio_corte3 = countCorte3 > 0 ? sumCorte3 / countCorte3 : 0;

        return boletin;
    }
    async getStudentsByProfessorId(professorId: number): Promise<{ nombre_asignatura: string; students: { id: number; nombres_apellidos: string;grado:string; id_score: number }[] }[]> {
        const subjects = await new SubjectService().getSubjectsIdsByProfessorId(professorId);
        const subjectsId = subjects.map(subject => subject.id);
        const studentsScores = await new ScoreService().getScoresBySubjectId(subjectsId);
        const result = await Promise.all(subjects.map(async subject => {
            const subjectsScores = studentsScores.filter(score => score.id_subject === subject.id);
            const studentIds = subjectsScores.map(score => score.id_student);
            const students = await this.studentRepository.find({
                where: { id: In(studentIds)},
                select: ["id", "nombres_apellidos", "grado"]
            });

            const mappedStudents = subjectsScores.map(score => {
                const student = students.find(s => s.id === score.id_student);
                return student ? {
                    id : student.id,
                    nombres_apellidos: student.nombres_apellidos,
                    grado: student.grado,
                    id_score : score.id
                } : null  
            }).filter(Boolean) as {id: number; nombres_apellidos: string;grado:string; id_score: number;}[];

            return {
                nombre_asignatura: subject.nombre,
                students: mappedStudents
            };
        }));

        return result;
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