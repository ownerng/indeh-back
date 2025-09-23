import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { CreateStudentDTO } from "../dtos/createStudentDTO";
import { PgStudent } from "../entities/PgStudent";
import { ScoreService } from "./score.service";
import { SubjectService } from "./subject.service";
import { UserService } from "./user.service";
import { boletinDTO, Observaciones } from "../dtos/boletinDTO";
import { ciclo, porcentual, desem, obs, stateStudent } from "../utils/utils";
import { PgSubject } from "../entities/PgSubject";
import { PgScore } from "../entities/PgScore";
import * as path from "path";
import * as fs from "fs";
import * as handlebars from "handlebars";
import * as puppeteer from "puppeteer";
import { BoletinService } from "./boletin.service";
import { Jornada } from "../entities/Jornada";
import { UserRole } from "../entities/UserRole";
import * as ExcelJS from "exceljs";
import { ValoracionDTO, EstudianteValoracion, PeriodoNota } from "../dtos/valoracionDTO";
import { PDFDocument } from 'pdf-lib';


export class StudentService {
    private studentRepository = AppDataSource.getRepository(PgStudent);

    async createStudent(studentData: CreateStudentDTO): Promise<PgStudent> {
        const student = this.studentRepository.create(this.toPgStudent(studentData));
        const savedStudent = await this.studentRepository.save(student);

        // Asignar materias según jornada y grado
        const allSubjects = await new SubjectService().getAllSubjects();
        const subjectsForJornada = allSubjects.filter(s => s.jornada === savedStudent.jornada);

        // Filtrar materias según el grado
        const gradoNum = parseInt(savedStudent.grado);
        let filteredSubjects: typeof subjectsForJornada = [];

        if (!isNaN(gradoNum)) {
            if (gradoNum >= 1 && gradoNum <= 9) {
                // 1 a 9: todas excepto filosofia y fisica
                filteredSubjects = subjectsForJornada.filter(
                    s => s.nombre.toLowerCase() !== "filosofia" && s.nombre.toLowerCase() !== "fisica"
                );
            } else if (gradoNum >= 10 && gradoNum <= 11) {
                // 10 y 11: todas excepto sociales
                filteredSubjects = subjectsForJornada.filter(
                    s => s.nombre.toLowerCase() !== "sociales"
                );
            } else {
                // Otros grados: asignar todas las materias de la jornada
                filteredSubjects = subjectsForJornada;
            }
        } else {
            filteredSubjects = subjectsForJornada;
        }

        for (const subject of filteredSubjects) {
            await new ScoreService().createScore({
                id_student: savedStudent.id,
                id_subject: subject.id
            });
        }

        return savedStudent;
    }

    async getAllStudents(): Promise<PgStudent[]> {
    return await this.studentRepository.find({
        where: { estado: 'Activo' }
    });
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

        const oldJornada = student.jornada;
        const oldGrado = student.grado;
        student.nombres_apellidos = studentData.nombres_apellidos;
        student.tipo_documento = studentData.tipo_documento;
        student.numero_documento = studentData.numero_documento;
        student.expedicion_documento = studentData.expedicion_documento;
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
        student.jornada = studentData.jornada;
        student.grado = studentData.grado;
        student.discapacidad = studentData.discapacidad;
        student.fecha_modificacion = studentData.fecha_modificacion;
        student.nombres_apellidos_acudiente = studentData.nombres_apellidos_acudiente;
        student.numero_documento_acudiente = studentData.numero_documento_acudiente;
        student.expedicion_documento_acudiente = studentData.expedicion_documento_acudiente;
        student.telefono_acudiente = studentData.telefono_acudiente;
        student.direccion_acudiente = studentData.direccion_acudiente;
        student.email_acudiente = studentData.email_acudiente;
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

        const scoreService = new ScoreService();
        const subjectService = new SubjectService();

        // Obtener los scores actuales del estudiante
        const currentScores = await scoreService.getScoresByStudentId(student.id);
        // Obtener materias de la nueva jornada
        const allSubjects = await subjectService.getAllSubjects();
        const subjectsForJornada = allSubjects.filter(s => s.jornada === studentData.jornada);

        // Filtrar materias según el nuevo grado
        const gradoNum = parseInt(studentData.grado);
        let filteredSubjects: typeof subjectsForJornada = [];

        if (!isNaN(gradoNum)) {
            if (gradoNum >= 1 && gradoNum <= 9) {
                filteredSubjects = subjectsForJornada.filter(
                    s => s.nombre.toLowerCase() !== "filosofia" && s.nombre.toLowerCase() !== "fisica"
                );
            } else if (gradoNum >= 10 && gradoNum <= 11) {
                filteredSubjects = subjectsForJornada.filter(
                    s => s.nombre.toLowerCase() !== "sociales"
                );
            } else {
                filteredSubjects = subjectsForJornada;
            }
        } else {
            filteredSubjects = subjectsForJornada;
        }

        // Mapear materias actuales por nombre (para comparar)
        const currentScoresBySubjectName = new Map(
            currentScores.map(score => [score.id_subject.nombre.toLowerCase(), score])
        );

        for (const subject of filteredSubjects) {
            const subjectName = subject.nombre.toLowerCase();
            const existingScore = currentScoresBySubjectName.get(subjectName);

            if (existingScore) {
                // Actualiza el id_subject del score existente a la materia de la nueva jornada
                await scoreService.updatescoreById(existingScore.id, {
                    id_student: student.id,
                    id_subject: subject.id
                });
                currentScoresBySubjectName.delete(subjectName);
            } else {
                // Si no existe score para esta materia, crea uno nuevo
                await scoreService.createScore({
                    id_student: student.id,
                    id_subject: subject.id
                });
            }
        }

        // Elimina scores de materias que ya no están en la nueva jornada y grado
        for (const score of currentScoresBySubjectName.values()) {
            await scoreService.deleteScoreById(score.id);
        }

        return await this.studentRepository.save(student);
    }

    async getStudentsByGrade(grado: string, jornada: Jornada): Promise<PgStudent[] | null> {
        const student = await this.studentRepository.findBy({ grado: grado, jornada: jornada, estado: 'Activo' });
        if (!student) {
            return null;
        }
        return student;

    }

    async getBoletinByStudentId(studentId: number, obse: string, ciclo: string, is_final: boolean): Promise<boletinDTO | null> {
        // Traer todos los scores del estudiante
        const scores: PgScore[] = await new ScoreService().getScoresByStudentId(studentId);

        if (scores.length === 0) {
            return null;
        }

        const student = await this.studentRepository.findOne({ where: { id: studentId , estado: 'Activo'} });
        if (!student) return null;

        // Filtrar los scores para que solo sean del ciclo Y jornada del estudiante
        const subjectService = new SubjectService();
        const filteredScores: PgScore[] = [];
        for (const score of scores) {
            // Traer la materia asociada al score
            const subject = await subjectService.getSubjectById(score.id_subject.id);
            // AQUÍ ESTÁ LA CORRECCIÓN: filtrar por ciclo Y jornada
            if (subject && subject.ciclo === ciclo && subject.jornada === student.jornada) {
                filteredScores.push(score);
            }
        }

        const boletin: boletinDTO = {
            fecha_creacion: new Date().toLocaleDateString(),
            nombres_apellidos: student.nombres_apellidos,
            grado: student.grado,
            ciclo: ciclo,
            state: '',
            jornada: student.jornada,
            puesto_final: 0,
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
            castellano_obs: '',
            biologia_corte1: 0,
            biologia_corte2: 0,
            biologia_corte3: 0,
            biologia_desem1: '',
            biologia_desem2: '',
            biologia_desem3: '',
            biologia_porcentual1: 0,
            biologia_porcentual2: 0,
            biologia_porcentual3: 0,
            biologia_def: 0,
            biologia_obs: '',
            sociales_corte1: 0,
            sociales_corte2: 0,
            sociales_corte3: 0,
            sociales_desem1: '',
            sociales_desem2: '',
            sociales_desem3: '',
            sociales_porcentual1: 0,
            sociales_porcentual2: 0,
            sociales_porcentual3: 0,
            sociales_def: 0,
            sociales_obs: '',
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
            ingles_obs: '',
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
            quimica_obs: '',
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
            fisica_obs: '',
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
            matematicas_obs: '',
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
            emprendimiento_obs: '',
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
            filosofia_obs: '',
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
            etica_religion_obs: '',
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
            informatica_obs: '',
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
            ed_fisica_obs: '',
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
            comportamiento_obs: '',
            puesto_corte1: 0,
            puesto_corte2: 0,
            puesto_corte3: 0,
            obs: obse,
        };

        // Procesa cada score y llena el boletin - USAR filteredScores en lugar de scores
        for (const score of filteredScores) {
            const subject = await subjectService.getSubjectById(score.id_subject.id);
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
                boletin.castellano_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';
            } else if (nombre === "biologia") {
                boletin.biologia_corte1 = score.corte1 ?? 0;
                boletin.biologia_corte2 = score.corte2 ?? 0;
                boletin.biologia_corte3 = score.corte3 ?? 0;
                boletin.biologia_def = score.notadefinitiva ?? 0;

                boletin.biologia_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.biologia_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.biologia_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.biologia_desem1 = desem(score.corte1 ?? 0);
                boletin.biologia_desem2 = desem(score.corte2 ?? 0);
                boletin.biologia_desem3 = desem(score.corte3 ?? 0);

                boletin.biologia_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';
            } else if (nombre === "sociales") {
                boletin.sociales_corte1 = score.corte1 ?? 0;
                boletin.sociales_corte2 = score.corte2 ?? 0;
                boletin.sociales_corte3 = score.corte3 ?? 0;
                boletin.sociales_def = score.notadefinitiva ?? 0;

                boletin.sociales_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.sociales_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.sociales_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.sociales_desem1 = desem(score.corte1 ?? 0);
                boletin.sociales_desem2 = desem(score.corte2 ?? 0);
                boletin.sociales_desem3 = desem(score.corte3 ?? 0);

                boletin.sociales_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';
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

                boletin.ingles_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';
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

                boletin.quimica_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';
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

                boletin.fisica_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';
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

                boletin.matematicas_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';
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
                boletin.emprendimiento_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';

            } else if (nombre === "filosofia") {
                boletin.filosofia_corte1 = score.corte1 ?? 0;
                boletin.filosofia_corte2 = score.corte2 ?? 0;
                boletin.filosofia_corte3 = score.corte3 ?? 0;
                boletin.filosofia_def = score.notadefinitiva ?? 0;

                boletin.filosofia_porcentual1 = porcentual(score.corte1 ?? 0, 0.3);
                boletin.filosofia_porcentual2 = porcentual(score.corte2 ?? 0, 0.3);
                boletin.filosofia_porcentual3 = porcentual(score.corte3 ?? 0, 0.4);

                boletin.filosofia_desem1 = desem(score.corte1 ?? 0);
                boletin.filosofia_desem2 = desem(score.corte2 ?? 0);
                boletin.filosofia_desem3 = desem(score.corte3 ?? 0);
                boletin.filosofia_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';
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
                boletin.etica_religion_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';
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
                boletin.informatica_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';
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
                boletin.ed_fisica_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';
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
                boletin.comportamiento_obs = is_final ? obs(score.notadefinitiva ?? 0) : '';
            }
        }

        const gradoNum = parseInt(student.grado);

        let definitivas: number[] = [];
        if (!isNaN(gradoNum) && gradoNum < 9) {
            // Menor a 9: usar sociales en vez de filosofia y quitar fisica
            definitivas = [
                boletin.castellano_def,
                boletin.ingles_def,
                boletin.quimica_def,
                boletin.sociales_def,
                boletin.matematicas_def,
                boletin.emprendimiento_def,
                boletin.etica_religion_def,
                boletin.informatica_def,
                boletin.ed_fisica_def
            ];
        } else {
            // 9 o más: usar materias normales
            definitivas = [
                boletin.castellano_def,
                boletin.ingles_def,
                boletin.quimica_def,
                boletin.fisica_def,
                boletin.matematicas_def,
                boletin.emprendimiento_def,
                boletin.etica_religion_def,
                boletin.informatica_def,
                boletin.ed_fisica_def
            ];
        }

        const materiasBajas = definitivas.filter(def => def <= 2.9).length;

        boletin.state = is_final ? stateStudent(materiasBajas): '';

        return boletin;
    }

    async getStudentsByProfessorId(professorId: number): Promise<{ nombre_asignatura: string; jornada: string; ciclo: string | null; students: { id: number; nombres_apellidos: string; grado: string; id_score: number }[] }[]> {
    const subjects = await new SubjectService().getSubjectsIdsByProfessorId(professorId);
    const subjectsId = subjects.map(subject => subject.id);
    const studentsScores = await new ScoreService().getScoresBySubjectId(subjectsId);
    
    const result = await Promise.all(subjects.map(async subject => {
        // CORRECCIÓN: Filtrar scores para esta materia específica
        const subjectsScores = studentsScores.filter(score => score.id_subject === subject.id);
        const studentIds = subjectsScores.map(score => score.id_student);
        
        const students = await this.studentRepository.find({
            where: { id: In(studentIds), estado: "Activo" },
            select: ["id", "nombres_apellidos", "grado", "estado"]
        });

        // Crear un Map para evitar duplicados por estudiante
        const studentMap = new Map<number, { id: number; nombres_apellidos: string; grado: string; id_score: number }>();
        
        subjectsScores.forEach(score => {
            const student = students.find(s => s.id === score.id_student);
            if (student && student.estado === "Activo") {
                // Solo agregar si no existe
                if (!studentMap.has(student.id)) {
                    studentMap.set(student.id, {
                        id: student.id,
                        nombres_apellidos: student.nombres_apellidos,
                        grado: student.grado,
                        id_score: score.id
                    });
                }
            }
        });

        return {
            nombre_asignatura: subject.nombre,
            jornada: subject.jornada,
            ciclo: subject.ciclo,
            students: Array.from(studentMap.values())
        };
    }));

    return result;
}
    private toPgStudent(student: CreateStudentDTO): PgStudent {
        const pgStudent = new PgStudent();
        pgStudent.nombres_apellidos = student.nombres_apellidos;
        pgStudent.tipo_documento = student.tipo_documento;
        pgStudent.numero_documento = student.numero_documento;
        pgStudent.expedicion_documento = student.expedicion_documento;
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
        pgStudent.jornada = student.jornada;
        pgStudent.grado = student.grado;
        pgStudent.discapacidad = student.discapacidad;
        pgStudent.fecha_modificacion = student.fecha_modificacion;
        pgStudent.nombres_apellidos_acudiente = student.nombres_apellidos_acudiente;
        pgStudent.numero_documento_acudiente = student.numero_documento_acudiente;
        pgStudent.expedicion_documento_acudiente = student.expedicion_documento_acudiente;
        pgStudent.telefono_acudiente = student.telefono_acudiente;
        pgStudent.direccion_acudiente = student.direccion_acudiente;
        pgStudent.email_acudiente = student.email_acudiente;
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

    async updateScoresForStudents(): Promise<void> {
        const students = await this.studentRepository.find();
        const scoreService = new ScoreService();
        const subjectService = new SubjectService();
        const allSubjects = await subjectService.getAllSubjects();

        for (const student of students) {
            const studentId = student.id;
            if (!studentId) continue;

            // 1. ELIMINAR TODOS LOS DUPLICADOS EXISTENTES PRIMERO
            let currentScores = await scoreService.getScoresByStudentId(student.id);
            
            // Crear un Map para trackear las combinaciones únicas
            const seenCombinations = new Set<string>();
            const duplicatesToDelete: number[] = [];

            for (const score of currentScores) {
                const combination = `${score.id_student}-${score.id_subject.id}`;
                
                if (seenCombinations.has(combination)) {
                    // Ya existe esta combinación, marcar este score para eliminar
                    duplicatesToDelete.push(score.id);
                } else {
                    // Primera vez que vemos esta combinación, conservarla
                    seenCombinations.add(combination);
                }
            }

            // Eliminar todos los duplicados encontrados
            for (const scoreIdToDelete of duplicatesToDelete) {
                await scoreService.deleteScoreById(scoreIdToDelete);
            }

            // 2. OBTENER SCORES ACTUALIZADOS (sin duplicados)
            currentScores = await scoreService.getScoresByStudentId(student.id);

            // 3. FILTRAR MATERIAS SEGÚN JORNADA Y GRADO
            const subjectsForJornada = allSubjects.filter(s => s.jornada === student.jornada);
            const gradoNum = parseInt(student.grado);
            let filteredSubjects: typeof subjectsForJornada = [];

            if (!isNaN(gradoNum)) {
                if (gradoNum >= 1 && gradoNum <= 9) {
                    filteredSubjects = subjectsForJornada.filter(
                        s => s.nombre.toLowerCase() !== "filosofia" && s.nombre.toLowerCase() !== "fisica"
                    );
                } else if (gradoNum >= 10 && gradoNum <= 11) {
                    filteredSubjects = subjectsForJornada.filter(
                        s => s.nombre.toLowerCase() !== "sociales"
                    );
                } else {
                    filteredSubjects = subjectsForJornada;
                }
            } else {
                filteredSubjects = subjectsForJornada;
            }

            // 4. ELIMINAR SCORES QUE NO CORRESPONDEN A LAS MATERIAS VÁLIDAS PRIMERO
            const validSubjectIds = new Set(filteredSubjects.map(s => s.id));
            
            for (const score of currentScores) {
                if (!validSubjectIds.has(score.id_subject.id)) {
                    await scoreService.deleteScoreById(score.id);
                }
            }

            // 5. OBTENER SCORES FINALES DESPUÉS DE LIMPIAR
            const finalCurrentScores = await scoreService.getScoresByStudentId(student.id);
            
            // 6. CREAR SCORES FALTANTES
            const existingSubjectIds = new Set(
                finalCurrentScores.map(score => score.id_subject.id)
            );

            for (const subject of filteredSubjects) {
                if (!existingSubjectIds.has(subject.id)) {
                    // Solo crear si no existe ya
                    await scoreService.createScore({
                        id_student: student.id,
                        id_subject: subject.id
                    });
                }
            }
        }
    }

    async getBoletinesByGradoWithRanking(
        grado: string,
        jornada: Jornada,
        observaciones: Observaciones[], 
        ciclo: string, 
        is_final: boolean
    ): Promise<{ filename: string; buffer: Buffer }[]> {

        const students = await this.studentRepository.find({ where: { grado: grado, jornada: jornada, estado: "Activo" } });

        // 1. Calcular promedios de definitivas y cortes para cada estudiante según su grado
        type PromedioData = {
            student: PgStudent;
            promedioDef: number;
            promedioCorte1: number;
            promedioCorte2: number;
            promedioCorte3: number;
            boletin: boletinDTO;
        };

        const studentPromedios: PromedioData[] = [];
        for (const student of students) {
            const boletin = await this.getBoletinByStudentId(student.id, "", ciclo, is_final);
            if (!boletin) continue;

            const gradoNum = parseInt(student.grado);
            let definitivas: number[] = [];
            let corte1: number[] = [];
            let corte2: number[] = [];
            let corte3: number[] = [];

            if (!isNaN(gradoNum) && gradoNum < 9) {
                definitivas = [
                    boletin.castellano_def,
                    boletin.ingles_def,
                    boletin.quimica_def,
                    boletin.sociales_def,
                    boletin.matematicas_def,
                    boletin.emprendimiento_def,
                    boletin.etica_religion_def,
                    boletin.informatica_def,
                    boletin.ed_fisica_def
                ];
                corte1 = [
                    boletin.castellano_porcentual1,
                    boletin.ingles_porcentual1,
                    boletin.quimica_porcentual1,
                    boletin.sociales_porcentual1,
                    boletin.matematicas_porcentual1,
                    boletin.emprendimiento_porcentual1,
                    boletin.etica_religion_porcentual1,
                    boletin.informatica_porcentual1,
                    boletin.ed_fisica_porcentual1
                ];
                corte2 = [
                    boletin.castellano_porcentual2,
                    boletin.ingles_porcentual2,
                    boletin.quimica_porcentual2,
                    boletin.sociales_porcentual2,
                    boletin.matematicas_porcentual2,
                    boletin.emprendimiento_porcentual2,
                    boletin.etica_religion_porcentual2,
                    boletin.informatica_porcentual2,
                    boletin.ed_fisica_porcentual2
                ];corte3 = [
                    boletin.castellano_porcentual3,
                    boletin.ingles_porcentual3,
                    boletin.quimica_porcentual3,
                    boletin.sociales_porcentual3,
                    boletin.matematicas_porcentual3,
                    boletin.emprendimiento_porcentual3,
                    boletin.etica_religion_porcentual3,
                    boletin.informatica_porcentual3,
                    boletin.ed_fisica_porcentual3
                ];
            } else {
                definitivas = [
                    boletin.castellano_def,
                    boletin.ingles_def,
                    boletin.quimica_def,
                    boletin.fisica_def,
                    boletin.matematicas_def,
                    boletin.emprendimiento_def,
                    boletin.etica_religion_def,
                    boletin.informatica_def,
                    boletin.ed_fisica_def
                ];
                corte1 = [
                    boletin.castellano_porcentual1,
                    boletin.ingles_porcentual1,
                    boletin.quimica_porcentual1,
                    boletin.fisica_porcentual1,
                    boletin.matematicas_porcentual1,
                    boletin.emprendimiento_porcentual1,
                    boletin.etica_religion_porcentual1,
                    boletin.informatica_porcentual1,
                    boletin.ed_fisica_porcentual1
                ];
                corte2 = [
                    boletin.castellano_porcentual2,
                    boletin.ingles_porcentual2,
                    boletin.quimica_porcentual2,
                    boletin.fisica_porcentual2,
                    boletin.matematicas_porcentual2,
                    boletin.emprendimiento_porcentual2,
                    boletin.etica_religion_porcentual2,
                    boletin.informatica_porcentual2,
                    boletin.ed_fisica_porcentual2
                ];
                corte3 = [
                    boletin.castellano_porcentual3,
                    boletin.ingles_porcentual3,
                    boletin.quimica_porcentual3,
                    boletin.fisica_porcentual3,
                    boletin.matematicas_porcentual3,
                    boletin.emprendimiento_porcentual3,
                    boletin.etica_religion_porcentual3,
                    boletin.informatica_porcentual3,
                    boletin.ed_fisica_porcentual3
                ];
            }

            const definitivasValidas = definitivas.filter(n => typeof n === "number");
            const promedioDef = definitivasValidas.length > 0
                ? definitivasValidas.reduce((a, b) => a + b, 0) / definitivasValidas.length
                : 0;

            const corte1Validas = corte1.filter(n => typeof n === "number");
            const promedioCorte1 = corte1Validas.length > 0
                ? corte1Validas.reduce((a, b) => a + b, 0) / corte1Validas.length
                : 0;

            const corte2Validas = corte2.filter(n => typeof n === "number");
            const promedioCorte2 = corte2Validas.length > 0
                ? corte2Validas.reduce((a, b) => a + b, 0) / corte2Validas.length
                : 0;

            const corte3Validas = corte3.filter(n => typeof n === "number");
            const promedioCorte3 = corte3Validas.length > 0
                ? corte3Validas.reduce((a, b) => a + b, 0) / corte3Validas.length
                : 0;

            studentPromedios.push({ student, promedioDef, promedioCorte1, promedioCorte2, promedioCorte3, boletin });
        }

        // 2. Rankear estudiantes por cada promedio
        const rankingDef = [...studentPromedios].sort((a, b) => b.promedioDef - a.promedioDef);
        const rankingCorte1 = [...studentPromedios].sort((a, b) => b.promedioCorte1 - a.promedioCorte1);
        const rankingCorte2 = [...studentPromedios].sort((a, b) => b.promedioCorte2 - a.promedioCorte2);
        const rankingCorte3 = [...studentPromedios].sort((a, b) => b.promedioCorte3 - a.promedioCorte3);

        // 3. Asignar puestos a cada estudiante en cada ranking
        for (const [i, data] of rankingDef.entries()) {
            data.boletin.puesto_final = i + 1;
        }
        for (const [i, data] of rankingCorte1.entries()) {
            data.boletin.puesto_corte1 = i + 1;
        }
        for (const [i, data] of rankingCorte2.entries()) {
            data.boletin.puesto_corte2 = i + 1;
        }
        for (const [i, data] of rankingCorte3.entries()) {
            data.boletin.puesto_corte3 = i + 1;
        }

        // 4. Generar los boletines PDF con los puestos asignados
        const pdfBuffers: { filename: string; buffer: Buffer }[] = [];
        for (const data of studentPromedios) {
            const { student, boletin } = data;

            // Buscar la observación personalizada para este estudiante
            const obsObj = observaciones.find(o => o.id_student === student.id);
            const obse = obsObj ? obsObj.obse : "";
            boletin.obs = obse;

            await new BoletinService().createBoletin(student, boletin);

            // Seleccionar plantilla según grado
            const templateFile = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(boletin.grado)
                ? 'boletin6.html'
                : 'boletin.html';
            const templatePath = path.join(process.cwd(), 'dist', 'templates', templateFile);
            const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
            const compiledTemplate = handlebars.compile(htmlTemplate);
            const content = compiledTemplate(boletin);

            // Generar PDF con Puppeteer
            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.setContent(content, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({ format: 'Letter', printBackground: true });
            await browser.close();

            pdfBuffers.push({
                filename: `boletin-${student.nombres_apellidos.replace(/ /g, "_")}-puesto${boletin.puesto_final}.pdf`,
                buffer: Buffer.from(pdfBuffer)
            });
        }

        return pdfBuffers;
    }

    async getBoletinByGradoWithRankingForStudent(
        grado: string,
        jornada: Jornada,
        observacion: Observaciones, 
        ciclo: string,
        is_final: boolean
    ): Promise<{ filename: string; buffer: Buffer } | null> {

        const students = await this.studentRepository.find({ where: { grado: grado, jornada: jornada, estado: "Activo" } });

        // 1. Calcular promedios de definitivas y cortes para cada estudiante según su grado
        type PromedioData = {
            student: PgStudent;
            promedioDef: number;
            promedioCorte1: number;
            promedioCorte2: number;
            promedioCorte3: number;
            boletin: boletinDTO;
        };

        const studentPromedios: PromedioData[] = [];
        for (const student of students) {
            const boletin = await this.getBoletinByStudentId(student.id, "", ciclo, is_final);
            if (!boletin) continue;

            const gradoNum = parseInt(student.grado);
            let definitivas: number[] = [];
            let corte1: number[] = [];
            let corte2: number[] = [];
            let corte3: number[] = [];

            if (!isNaN(gradoNum) && gradoNum < 9) {
                definitivas = [
                    boletin.castellano_def,
                    boletin.ingles_def,
                    boletin.quimica_def,
                    boletin.sociales_def,
                    boletin.matematicas_def,
                    boletin.emprendimiento_def,
                    boletin.etica_religion_def,
                    boletin.informatica_def,
                    boletin.ed_fisica_def
                ];
                corte1 = [
                    boletin.castellano_porcentual1,
                    boletin.ingles_porcentual1,
                    boletin.quimica_porcentual1,
                    boletin.sociales_porcentual1,
                    boletin.matematicas_porcentual1,
                    boletin.emprendimiento_porcentual1,
                    boletin.etica_religion_porcentual1,
                    boletin.informatica_porcentual1,
                    boletin.ed_fisica_porcentual1
                ];
                corte2 = [
                    boletin.castellano_porcentual2,
                    boletin.ingles_porcentual2,
                    boletin.quimica_porcentual2,
                    boletin.sociales_porcentual2,
                    boletin.matematicas_porcentual2,
                    boletin.emprendimiento_porcentual2,
                    boletin.etica_religion_porcentual2,
                    boletin.informatica_porcentual2,
                    boletin.ed_fisica_porcentual2
                ];corte3 = [
                    boletin.castellano_porcentual3,
                    boletin.ingles_porcentual3,
                    boletin.quimica_porcentual3,
                    boletin.sociales_porcentual3,
                    boletin.matematicas_porcentual3,
                    boletin.emprendimiento_porcentual3,
                    boletin.etica_religion_porcentual3,
                    boletin.informatica_porcentual3,
                    boletin.ed_fisica_porcentual3
                ];
            } else {
                definitivas = [
                    boletin.castellano_def,
                    boletin.ingles_def,
                    boletin.quimica_def,
                    boletin.fisica_def,
                    boletin.matematicas_def,
                    boletin.emprendimiento_def,
                    boletin.etica_religion_def,
                    boletin.informatica_def,
                    boletin.ed_fisica_def
                ];
                corte1 = [
                    boletin.castellano_porcentual1,
                    boletin.ingles_porcentual1,
                    boletin.quimica_porcentual1,
                    boletin.fisica_porcentual1,
                    boletin.matematicas_porcentual1,
                    boletin.emprendimiento_porcentual1,
                    boletin.etica_religion_porcentual1,
                    boletin.informatica_porcentual1,
                    boletin.ed_fisica_porcentual1
                ];
                corte2 = [
                    boletin.castellano_porcentual2,
                    boletin.ingles_porcentual2,
                    boletin.quimica_porcentual2,
                    boletin.fisica_porcentual2,
                    boletin.matematicas_porcentual2,
                    boletin.emprendimiento_porcentual2,
                    boletin.etica_religion_porcentual2,
                    boletin.informatica_porcentual2,
                    boletin.ed_fisica_porcentual2
                ];
                corte3 = [
                    boletin.castellano_porcentual3,
                    boletin.ingles_porcentual3,
                    boletin.quimica_porcentual3,
                    boletin.fisica_porcentual3,
                    boletin.matematicas_porcentual3,
                    boletin.emprendimiento_porcentual3,
                    boletin.etica_religion_porcentual3,
                    boletin.informatica_porcentual3,
                    boletin.ed_fisica_porcentual3
                ];
            }

            const definitivasValidas = definitivas.filter(n => typeof n === "number");
            const promedioDef = definitivasValidas.length > 0
                ? definitivasValidas.reduce((a, b) => a + b, 0) / definitivasValidas.length
                : 0;

            const corte1Validas = corte1.filter(n => typeof n === "number");
            const promedioCorte1 = corte1Validas.length > 0
                ? corte1Validas.reduce((a, b) => a + b, 0) / corte1Validas.length
                : 0;

            const corte2Validas = corte2.filter(n => typeof n === "number");
            const promedioCorte2 = corte2Validas.length > 0
                ? corte2Validas.reduce((a, b) => a + b, 0) / corte2Validas.length
                : 0;

            const corte3Validas = corte3.filter(n => typeof n === "number");
            const promedioCorte3 = corte3Validas.length > 0
                ? corte3Validas.reduce((a, b) => a + b, 0) / corte3Validas.length
                : 0;

            studentPromedios.push({ student, promedioDef, promedioCorte1, promedioCorte2, promedioCorte3, boletin });
        }

        // 2. Rankear estudiantes por cada promedio
        const rankingDef = [...studentPromedios].sort((a, b) => b.promedioDef - a.promedioDef);
        const rankingCorte1 = [...studentPromedios].sort((a, b) => b.promedioCorte1 - a.promedioCorte1);
        const rankingCorte2 = [...studentPromedios].sort((a, b) => b.promedioCorte2 - a.promedioCorte2);
        const rankingCorte3 = [...studentPromedios].sort((a, b) => b.promedioCorte3 - a.promedioCorte3);

        // 3. Asignar puestos a cada estudiante en cada ranking
        for (const [i, data] of rankingDef.entries()) {
            data.boletin.puesto_final = i + 1;
        }
        for (const [i, data] of rankingCorte1.entries()) {
            data.boletin.puesto_corte1 = i + 1;
        }
        for (const [i, data] of rankingCorte2.entries()) {
            data.boletin.puesto_corte2 = i + 1;
        }
        for (const [i, data] of rankingCorte3.entries()) {
            data.boletin.puesto_corte3 = i + 1;
        }

        // 4. Buscar el estudiante solicitado por observacion.id_student y generar su PDF
        const data = studentPromedios.find(d => d.student.id === observacion.id_student);
        if (!data) return null;

        const { student, boletin } = data;

        // Añadir la observación específica
        boletin.obs = observacion.obse;

        await new BoletinService().createBoletin(student, boletin);

        // Seleccionar plantilla según grado
        const templateFile = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(boletin.grado)
            ? 'boletin6.html'
            : 'boletin.html';
        const templatePath = path.join(process.cwd(), 'dist', 'templates', templateFile);
        const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
        const compiledTemplate = handlebars.compile(htmlTemplate);
        const content = compiledTemplate(boletin);

        // Generar PDF con Puppeteer
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(content, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'Letter', printBackground: true });
        await browser.close();

        return {
            filename: `boletin-${student.nombres_apellidos.replace(/ /g, "_")}-puesto${boletin.puesto_final}.pdf`,
            buffer: Buffer.from(pdfBuffer)
        };
    }

    async promoverEstudiante(studentId: number, gradoActual: string): Promise<string> {
        const student = await this.studentRepository.findOneBy({ id: studentId });
        if (!student) {
            return "Estudiante no encontrado.";
        }

        const gradoNum = parseInt(gradoActual);

        if (!isNaN(gradoNum)) {
            if (gradoNum < 11) {
                student.grado = (gradoNum + 1).toString();
                await this.studentRepository.save(student);
                return `El estudiante ha sido promovido al grado ${student.grado}.`;
            } else if (gradoNum === 11) {
                student.estado = "Graduado";
                await this.studentRepository.save(student);
                return "El estudiante se graduó.";
            } else {
                return "El grado proporcionado no es válido para promoción.";
            }
        } else {
            return "El grado actual no es un número válido.";
        }
    }

   async exportAllStudentsToExcel(): Promise<Buffer> {
        const students = await this.studentRepository.find();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Estudiantes");

        // Encabezados según la entidad PgStudent
        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Nombres y Apellidos", key: "nombres_apellidos", width: 30 },
            { header: "Tipo Documento", key: "tipo_documento", width: 10 },
            { header: "Número Documento", key: "numero_documento", width: 20 },
            { header: "Expedición Documento", key: "expedicion_documento", width: 20 },
            { header: "Fecha Nacimiento", key: "fecha_nacimiento", width: 15 },
            { header: "Teléfono", key: "telefono", width: 15 },
            { header: "Sexo", key: "sexo", width: 5 },
            { header: "Dirección", key: "direccion", width: 30 },
            { header: "EPS", key: "eps", width: 15 },
            { header: "Tipo Sangre", key: "tipo_sangre", width: 8 },
            { header: "Email", key: "email", width: 25 },
            { header: "Estado", key: "estado", width: 10 },
            { header: "Fecha Creación", key: "fecha_creacion", width: 20 },
            { header: "Subsidio", key: "subsidio", width: 15 },
            { header: "Categoría", key: "categoria", width: 15 },
            { header: "Jornada", key: "jornada", width: 10 },
            { header: "Grado", key: "grado", width: 8 },
            { header: "Discapacidad", key: "discapacidad", width: 15 },
            { header: "Fecha Modificación", key: "fecha_modificacion", width: 20 },
            { header: "Nombres Acudiente", key: "nombres_apellidos_acudiente", width: 30 },
            { header: "Número Documento Acudiente", key: "numero_documento_acudiente", width: 20 },
            { header: "Expedición Documento Acudiente", key: "expedicion_documento_acudiente", width: 20 },
            { header: "Teléfono Acudiente", key: "telefono_acudiente", width: 15 },
            { header: "Dirección Acudiente", key: "direccion_acudiente", width: 30 },
            { header: "Email Acudiente", key: "email_acudiente", width: 25 },
            { header: "Empresa Acudiente", key: "empresa_acudiente", width: 20 },
            { header: "Nombres Familiar 1", key: "nombres_apellidos_familiar1", width: 30 },
            { header: "Número Documento Familiar 1", key: "numero_documento_familiar1", width: 20 },
            { header: "Teléfono Familiar 1", key: "telefono_familiar1", width: 15 },
            { header: "Parentesco Familiar 1", key: "parentesco_familiar1", width: 15 },
            { header: "Empresa Familiar 1", key: "empresa_familiar1", width: 20 },
            { header: "Nombres Familiar 2", key: "nombres_apellidos_familiar2", width: 30 },
            { header: "Número Documento Familiar 2", key: "numero_documento_familiar2", width: 20 },
            { header: "Teléfono Familiar 2", key: "telefono_familiar2", width: 15 },
            { header: "Parentesco Familiar 2", key: "parentesco_familiar2", width: 15 },
            { header: "Empresa Familiar 2", key: "empresa_familiar2", width: 20 },
        ];

        // Agregar filas
        students.forEach(student => {
            // Helper function to safely convert to ISO string or empty string
            const toISOStringOrEmpty = (dateValue: any) => {
                if (dateValue instanceof Date) {
                    return dateValue.toISOString().split('T')[0];
                }
                // If it's a string, try to parse it as a Date
                if (typeof dateValue === 'string' && dateValue) {
                    const date = new Date(dateValue);
                    // Check if the parsed date is valid before converting
                    return isNaN(date.getTime()) ? "" : date.toISOString().split('T')[0];
                }
                return "";
            };

            worksheet.addRow({
                ...student,
                fecha_nacimiento: toISOStringOrEmpty(student.fecha_nacimiento),
                fecha_creacion: toISOStringOrEmpty(student.fecha_creacion),
                fecha_modificacion: toISOStringOrEmpty(student.fecha_modificacion)
            });
        });

        // Generar el buffer del archivo Excel
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    async getValoraciones(executiveId: number): Promise<Buffer | null> {
        try {
            // Obtener todos los usuarios con rol PROFESOR
            const userService = new UserService();
            const professors = await userService.getUsersByRole(UserRole.PROFESOR);
            
            if (professors.length === 0) {
                console.warn('No se encontraron profesores en el sistema');
                return null;
            }

            const currentYear = new Date().getFullYear().toString();
            const allValoracionesPdfs: Buffer[] = [];

            // Procesar cada profesor
            for (const professor of professors) {
                const professorId = professor.id;
                const professorName = professor.username || 'PROFESOR';

                // Obtener materias del profesor
                const subjects = await new SubjectService().getSubjectsIdsByProfessorId(professorId);
                
                if (subjects.length === 0) {
                    console.log(`No se encontraron materias para el profesor: ${professorName}`);
                    continue;
                }

                // Procesar cada materia del profesor
                for (const subject of subjects) {
                    if (!subject.ciclo) continue;

                    // Determinar el semestre basado en el ciclo
                    const cicloYear = subject.ciclo.split('-')[0];
                    const semestreNumber = subject.ciclo.split('-')[1];
                    
                    if (cicloYear !== currentYear) continue; // Solo ciclos del año actual

                    // Obtener estudiantes para esta materia
                    const scoreService = new ScoreService();
                    const scores = await scoreService.getScoresByCiclo(subject.ciclo);
                    
                    // Filtrar scores para esta materia específica
                    const subjectScores = scores.filter(score => score.id_subject.id === subject.id);
                    
                    if (subjectScores.length === 0) {
                        console.log(`Sin scores para la materia ${subject.nombre} (${subject.id}) en ciclo ${subject.ciclo}`);
                        continue;
                    }

                    // Obtener estudiantes únicos
                    const studentIds = [...new Set(subjectScores.map(score => score.id_student.id))];
                    const students = await this.studentRepository.find({
                        where: { id: In(studentIds), estado: "Activo" },
                        order: { nombres_apellidos: "ASC" }
                    });

                    // Si no hay estudiantes activos asociados a la materia, continuar
                    if (students.length === 0) {
                        console.log(`Sin estudiantes activos para la materia ${subject.nombre} (${subject.id}) en ciclo ${subject.ciclo}`);
                        continue;
                    }

                    // Construir datos de valoración
                    const estudiantesValoracion: EstudianteValoracion[] = students.map((student, index) => {
                        // Encontrar los scores del estudiante para esta materia
                        const studentScore = subjectScores.find(score => score.id_student.id === student.id);
                        
                        if (!studentScore) {
                            return {
                                numero: index + 1,
                                nombre: student.nombres_apellidos,
                                grado: student.grado,
                                primer_periodo: { nota: 0, porcentaje: 0 },
                                segundo_periodo: { nota: 0, porcentaje: 0 },
                                tercer_periodo: { nota: 0, porcentaje: 0 },
                                cuarto_periodo: { nota: 0, porcentaje: 0 },
                                quinto_periodo: { nota: 0, porcentaje: 0 },
                                sexto_periodo: { nota: 0, porcentaje: 0 },
                                nota_final_semestre: 0
                            };
                        }

                        // Mapear cortes a períodos según el semestre
                        let primerPeriodo: PeriodoNota, segundoPeriodo: PeriodoNota, tercerPeriodo: PeriodoNota;
                        let cuartoPeriodo: PeriodoNota, quintoPeriodo: PeriodoNota, sextoPeriodo: PeriodoNota;

                        if (semestreNumber === '1') {
                            // Primer semestre: cortes 1, 2, 3 -> períodos 1, 2, 3
                            primerPeriodo = { 
                                nota: studentScore.corte1 || 0, 
                                porcentaje: Number(((studentScore.corte1 || 0) * 0.15).toFixed(1))
                            };
                            segundoPeriodo = { 
                                nota: studentScore.corte2 || 0, 
                                porcentaje: Number(((studentScore.corte2 || 0) * 0.15).toFixed(1))
                            };
                            tercerPeriodo = { 
                                nota: studentScore.corte3 || 0, 
                                porcentaje: Number(((studentScore.corte3 || 0) * 0.20).toFixed(1))
                            };
                            cuartoPeriodo = { nota: 0, porcentaje: 0 };
                            quintoPeriodo = { nota: 0, porcentaje: 0 };
                            sextoPeriodo = { nota: 0, porcentaje: 0 };
                        } else {
                            // Segundo semestre: cortes 1, 2, 3 -> períodos 4, 5, 6
                            primerPeriodo = { nota: 0, porcentaje: 0 };
                            segundoPeriodo = { nota: 0, porcentaje: 0 };
                            tercerPeriodo = { nota: 0, porcentaje: 0 };
                            cuartoPeriodo = { 
                                nota: studentScore.corte1 || 0, 
                                porcentaje: Number(((studentScore.corte1 || 0) * 0.15).toFixed(1))
                            };
                            quintoPeriodo = { 
                                nota: studentScore.corte2 || 0, 
                                porcentaje: Number(((studentScore.corte2 || 0) * 0.15).toFixed(1))
                            };
                            sextoPeriodo = { 
                                nota: studentScore.corte3 || 0, 
                                porcentaje: Number(((studentScore.corte3 || 0) * 0.20).toFixed(1))
                            };
                        }

                        return {
                            numero: index + 1,
                            nombre: student.nombres_apellidos,
                            grado: student.grado,
                            primer_periodo: primerPeriodo,
                            segundo_periodo: segundoPeriodo,
                            tercer_periodo: tercerPeriodo,
                            cuarto_periodo: cuartoPeriodo,
                            quinto_periodo: quintoPeriodo,
                            sexto_periodo: sextoPeriodo,
                            nota_final_semestre: studentScore.notadefinitiva || 0
                        };
                    });

                    // Obtener grados únicos para mostrar en el reporte
                    const gradosUnicos = [...new Set(students.map(s => s.grado))].sort();

                    const valoracionData: ValoracionDTO = {
                        area: subject.nombre,
                        profesor: professorName,
                        ciclo: subject.ciclo,
                        jornada: subject.jornada,
                        semestre: semestreNumber === '1' ? 'I' : 'II',
                        grados: gradosUnicos.join(', '),
                        year: currentYear,
                        estudiantes: estudiantesValoracion
                    };

                    // Generar PDF para esta materia
                    const pdfBuffer = await this.generateValoracionPDF(valoracionData);
                    allValoracionesPdfs.push(pdfBuffer);
                }
            }

            if (allValoracionesPdfs.length === 0) {
                console.warn('No se generaron valoraciones para ningún profesor (sin materias o sin datos)');
                return null;
            }

            // Combinar todos los PDFs en uno solo
            const mergedPdf = await this.mergePDFs(allValoracionesPdfs);
            return mergedPdf;

        } catch (error) {
            console.error('Error en getValoraciones:', error);
            throw error;
        }
    }

    async getValoracionesByProfessor(professorId: number): Promise<Buffer | null> {
        try {
            const userService = new UserService();
            const professor = await userService.getUserById(professorId);
            if (!professor || professor.role !== UserRole.PROFESOR) {
                console.warn(`Usuario ${professorId} no es profesor o no existe`);
                return null;
            }

            const currentYear = new Date().getFullYear().toString();
            const professorName = professor.username || 'PROFESOR';
            const allValoracionesPdfs: Buffer[] = [];

            // Obtener materias del profesor
            const subjects = await new SubjectService().getSubjectsIdsByProfessorId(professorId);
            if (subjects.length === 0) {
                console.log(`No se encontraron materias para el profesor: ${professorName}`);
            }

            for (const subject of subjects) {
                if (!subject.ciclo) continue;
                const cicloYear = subject.ciclo.split('-')[0];
                const semestreNumber = subject.ciclo.split('-')[1];
                if (cicloYear !== currentYear) continue;

                const scoreService = new ScoreService();
                const scores = await scoreService.getScoresByCiclo(subject.ciclo);
                const subjectScores = scores.filter(score => score.id_subject.id === subject.id);
                if (subjectScores.length === 0) {
                    console.log(`Sin scores para la materia ${subject.nombre} (${subject.id}) en ciclo ${subject.ciclo}`);
                    continue;
                }

                const studentIds = [...new Set(subjectScores.map(score => score.id_student.id))];
                const students = await this.studentRepository.find({
                    where: { id: In(studentIds), estado: "Activo" },
                    order: { nombres_apellidos: "ASC" }
                });
                if (students.length === 0) {
                    console.log(`Sin estudiantes activos para la materia ${subject.nombre} (${subject.id}) en ciclo ${subject.ciclo}`);
                    continue;
                }

                const estudiantesValoracion: EstudianteValoracion[] = students.map((student, index) => {
                    const studentScore = subjectScores.find(score => score.id_student.id === student.id);
                    if (!studentScore) {
                        return {
                            numero: index + 1,
                            nombre: student.nombres_apellidos,
                            grado: student.grado,
                            primer_periodo: { nota: 0, porcentaje: 0 },
                            segundo_periodo: { nota: 0, porcentaje: 0 },
                            tercer_periodo: { nota: 0, porcentaje: 0 },
                            cuarto_periodo: { nota: 0, porcentaje: 0 },
                            quinto_periodo: { nota: 0, porcentaje: 0 },
                            sexto_periodo: { nota: 0, porcentaje: 0 },
                            nota_final_semestre: 0
                        };
                    }

                    let primerPeriodo: PeriodoNota, segundoPeriodo: PeriodoNota, tercerPeriodo: PeriodoNota;
                    let cuartoPeriodo: PeriodoNota, quintoPeriodo: PeriodoNota, sextoPeriodo: PeriodoNota;
                    if (semestreNumber === '1') {
                        primerPeriodo = { nota: studentScore.corte1 || 0, porcentaje: Number(((studentScore.corte1 || 0) * 0.15).toFixed(1)) };
                        segundoPeriodo = { nota: studentScore.corte2 || 0, porcentaje: Number(((studentScore.corte2 || 0) * 0.15).toFixed(1)) };
                        tercerPeriodo = { nota: studentScore.corte3 || 0, porcentaje: Number(((studentScore.corte3 || 0) * 0.20).toFixed(1)) };
                        cuartoPeriodo = { nota: 0, porcentaje: 0 };
                        quintoPeriodo = { nota: 0, porcentaje: 0 };
                        sextoPeriodo = { nota: 0, porcentaje: 0 };
                    } else {
                        primerPeriodo = { nota: 0, porcentaje: 0 };
                        segundoPeriodo = { nota: 0, porcentaje: 0 };
                        tercerPeriodo = { nota: 0, porcentaje: 0 };
                        cuartoPeriodo = { nota: studentScore.corte1 || 0, porcentaje: Number(((studentScore.corte1 || 0) * 0.15).toFixed(1)) };
                        quintoPeriodo = { nota: studentScore.corte2 || 0, porcentaje: Number(((studentScore.corte2 || 0) * 0.15).toFixed(1)) };
                        sextoPeriodo = { nota: studentScore.corte3 || 0, porcentaje: Number(((studentScore.corte3 || 0) * 0.20).toFixed(1)) };
                    }

                    return {
                        numero: index + 1,
                        nombre: student.nombres_apellidos,
                        grado: student.grado,
                        primer_periodo: primerPeriodo,
                        segundo_periodo: segundoPeriodo,
                        tercer_periodo: tercerPeriodo,
                        cuarto_periodo: cuartoPeriodo,
                        quinto_periodo: quintoPeriodo,
                        sexto_periodo: sextoPeriodo,
                        nota_final_semestre: studentScore.notadefinitiva || 0
                    };
                });

                const gradosUnicos = [...new Set(students.map(s => s.grado))].sort();
                const valoracionData: ValoracionDTO = {
                    area: subject.nombre,
                    profesor: professorName,
                    ciclo: subject.ciclo,
                    jornada: subject.jornada,
                    semestre: semestreNumber === '1' ? 'I' : 'II',
                    grados: gradosUnicos.join(', '),
                    year: currentYear,
                    estudiantes: estudiantesValoracion
                };

                const pdfBuffer = await this.generateValoracionPDF(valoracionData);
                allValoracionesPdfs.push(pdfBuffer);
            }

            if (allValoracionesPdfs.length === 0) {
                return null;
            }
            const mergedPdf = await this.mergePDFs(allValoracionesPdfs);
            return mergedPdf;
        } catch (error) {
            console.error('Error en getValoracionesByProfessor:', error);
            throw error;
        }
    }

    private async generateValoracionPDF(valoracionData: ValoracionDTO): Promise<Buffer> {
        // Construir las filas de estudiantes para el HTML
        const estudiantesRows = valoracionData.estudiantes.map(estudiante => 
            `<tr class="student-row">
                <td class="student-number">${estudiante.numero}</td>
                <td class="student-name">${estudiante.nombre}</td>
                <td class="grade-col">${estudiante.grado}</td>
                <td class="nota-col">${estudiante.primer_periodo.nota}</td>
                <td class="percent-col">${estudiante.primer_periodo.porcentaje}</td>
                <td class="nota-col">${estudiante.segundo_periodo.nota}</td>
                <td class="percent-col">${estudiante.segundo_periodo.porcentaje}</td>
                <td class="nota-col">${estudiante.tercer_periodo.nota}</td>
                <td class="percent-col">${estudiante.tercer_periodo.porcentaje}</td>
                <td class="nota-col">${estudiante.cuarto_periodo.nota}</td>
                <td class="percent-col">${estudiante.cuarto_periodo.porcentaje}</td>
                <td class="nota-col">${estudiante.quinto_periodo.nota}</td>
                <td class="percent-col">${estudiante.quinto_periodo.porcentaje}</td>
                <td class="nota-col">${estudiante.sexto_periodo.nota}</td>
                <td class="percent-col">${estudiante.sexto_periodo.porcentaje}</td>
                <td class="final-col">${estudiante.nota_final_semestre}</td>
            </tr>`
        ).join('\n');

        // Leer la plantilla HTML
        const templatePath = path.join(__dirname, '..', 'templates', 'valoracion.html');
        const templateHtml = fs.readFileSync(templatePath, 'utf8');

        // Compilar la plantilla con Handlebars
        const template = handlebars.compile(templateHtml);
        const html = template({
            AREA: valoracionData.area,
            PROFESOR: valoracionData.profesor,
            CICLO: valoracionData.ciclo,
            JORNADA: valoracionData.jornada,
            SEMESTRE: valoracionData.semestre,
            GRADOS: valoracionData.grados,
            YEAR: valoracionData.year,
            ESTUDIANTES_ROWS: estudiantesRows
        });

        // Generar PDF con Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({
                format: 'A4',
                margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
                printBackground: true
            });
            
            return Buffer.from(pdfBuffer);
        } finally {
            await browser.close();
        }
    }

    private async mergePDFs(pdfBuffers: Buffer[]): Promise<Buffer> {
        const mergedPdf = await PDFDocument.create();
        
        for (const pdfBuffer of pdfBuffers) {
            const pdf = await PDFDocument.load(pdfBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        
        const pdfBytes = await mergedPdf.save();
        return Buffer.from(pdfBytes);
    }
}