import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { CreateStudentDTO } from "../dtos/createStudentDTO";
import { PgStudent } from "../entities/PgStudent";
import { ScoreService } from "./score.service";
import { SubjectService } from "./subject.service";
import { boletinDTO, Observaciones } from "../dtos/boletinDTO";
import { ciclo, porcentual, desem, obs, stateStudent } from "../utils/utils";
import { PgSubject } from "../entities/PgSubject";
import { PgScore } from "../entities/PgScore";
import * as path from "path";
import * as fs from "fs";
import * as handlebars from "handlebars";
import * as puppeteer from "puppeteer";


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

    async getStudentsByGrade (grado: string): Promise<PgStudent[] | null> {
        const student = await this.studentRepository.findBy({ grado: grado });
        if (!student) {
            return null;
        }
        return student;

    }

    async getBoletinByStudentId(studentId: number, obse: string): Promise<boletinDTO | null> {
        const scores: PgScore[] = await new ScoreService().getScoresByStudentId(studentId);
        if (scores.length === 0) {
            return null;
        }

        const student = await this.studentRepository.findOne({ where: { id: studentId } });
        if (!student) return null;

        const boletin: boletinDTO = {
            fecha_creacion: new Date().toLocaleDateString(),
            nombres_apellidos: student.nombres_apellidos,
            grado: student.grado,
            ciclo: ciclo(new Date()),
            state: '',
            jornada: student.jornada,
            puesto: 1,
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
            promedio_corte1: 0,
            promedio_corte2: 0,
            promedio_corte3: 0,
            obs: obse,
        };

        // Procesa cada score y llena el boletin
        for (const score of scores) {
            const subject = await new SubjectService().getSubjectById(score.id_subject.id);
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
                boletin.castellano_obs = obs(score.notadefinitiva ?? 0);
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

                boletin.sociales_obs = obs(score.notadefinitiva ?? 0);
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

                boletin.sociales_obs = obs(score.notadefinitiva ?? 0);
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

                boletin.ingles_obs = obs(score.notadefinitiva ?? 0);
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

                boletin.quimica_obs = obs(score.notadefinitiva ?? 0);
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

                boletin.fisica_obs = obs(score.notadefinitiva ?? 0);
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

                boletin.matematicas_obs = obs(score.notadefinitiva ?? 0);
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
                boletin.emprendimiento_obs = obs(score.notadefinitiva ?? 0);

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
                boletin.filosofia_obs = obs(score.notadefinitiva ?? 0);
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
                boletin.etica_religion_obs = obs(score.notadefinitiva ?? 0);
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
                boletin.informatica_obs = obs(score.notadefinitiva ?? 0);
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
                boletin.ed_fisica_obs = obs(score.notadefinitiva ?? 0);
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
                boletin.comportamiento_obs = obs(score.notadefinitiva ?? 0);
            }
        }

        // Determinar materias para promedio según el grado
        let materiasParaPromedio: string[] = [];
        const gradoNum = parseInt(student.grado);

        if (!isNaN(gradoNum) && gradoNum < 9) {
            // Menor a 9: quitar fisica y cambiar filosofia por sociales
            materiasParaPromedio = [
                'castellano', 'ingles', 'quimica', 'sociales', 'biologia','matematicas',
                'emprendimiento', 'etica_religion', 'informatica', 'ed_fisica'
            ];
        } else {
            // 9 o más: dejar como estaba
            materiasParaPromedio = [
                'castellano', 'ingles', 'quimica', 'fisica', 'matematicas',
                'emprendimiento', 'etica_religion', 'informatica', 'ed_fisica'
            ];
        }

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

            if ((boletin as any)[corte1Key] !== null && (boletin as any)[corte1Key] !== undefined) {
                sumCorte1 += (boletin as any)[corte1Key];
                countCorte1++;
            }
            if ((boletin as any)[corte2Key] !== null && (boletin as any)[corte2Key] !== undefined) {
                sumCorte2 += (boletin as any)[corte2Key];
                countCorte2++;
            }
            if ((boletin as any)[corte3Key] !== null && (boletin as any)[corte3Key] !== undefined) {
                sumCorte3 += (boletin as any)[corte3Key];
                countCorte3++;
            }
        }

        const promedio1 = countCorte1 > 0 ? sumCorte1 / countCorte1 : 0;
        const promedio2 = countCorte2 > 0 ? sumCorte2 / countCorte2 : 0;
        const promedio3 = countCorte3 > 0 ? sumCorte3 / countCorte3 : 0;

        boletin.promedio_corte1 = Number.isFinite(promedio1) ? promedio1 : 0;
        boletin.promedio_corte2 = Number.isFinite(promedio2) ? promedio2 : 0;
        boletin.promedio_corte3 = Number.isFinite(promedio3) ? promedio3 : 0;

        // Contar materias con definitiva <= 2.9
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

        // Lógica para el estado del estudiante
        // Si el grado es menor a 9, se usa la lógica especial
        boletin.state = stateStudent(materiasBajas);

        return boletin;
    }
    async getStudentsByProfessorId(professorId: number): Promise<{ nombre_asignatura: string; jornada: string; students: { id: number; nombres_apellidos: string; grado: string; id_score: number }[] }[]> {
        const subjects = await new SubjectService().getSubjectsIdsByProfessorId(professorId);
        const subjectsId = subjects.map(subject => subject.id);
        const studentsScores = await new ScoreService().getScoresBySubjectId(subjectsId);
        const result = await Promise.all(subjects.map(async subject => {
            const subjectsScores = studentsScores.filter(score => score.id_subject === subject.id);
            const studentIds = subjectsScores.map(score => score.id_student);
            const students = await this.studentRepository.find({
                where: { id: In(studentIds) },
                select: ["id", "nombres_apellidos", "grado", "estado"]
            });

            const mappedStudents = subjectsScores.map(score => {
                const student = students.find(s => s.id === score.id_student && s.estado === "Activo");
                return student ? {
                    id: student.id,
                    nombres_apellidos: student.nombres_apellidos,
                    grado: student.grado,
                    id_score: score.id
                } : null
            }).filter(Boolean) as { id: number; nombres_apellidos: string; grado: string; id_score: number; }[];

            return {
                nombre_asignatura: subject.nombre,
                jornada: subject.jornada,
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

            // Filtrar materias según la jornada y grado del estudiante
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

            // Obtener los scores actuales del estudiante
            const currentScores = await scoreService.getScoresByStudentId(student.id);

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
        }
    }

    /**
     * Genera los boletines PDF de todos los estudiantes de un grado,
     * asignando puesto y observación individual a cada uno.
     * Devuelve un array de { filename, buffer } para ser zipeados.
     */
    async getBoletinesByGradoWithRanking(
        grado: string ,
        observaciones: Observaciones[]
    ): Promise<{ filename: string; buffer: Buffer }[]> {
        const students = await this.studentRepository.find({ where: { grado: grado, estado: "Activo" } });
        const scoreService = new ScoreService();

        // 1. Calcular promedios de notadefinitiva para cada estudiante
        const studentPromedios: { student: PgStudent; promedio: number }[] = [];
        for (const student of students) {
            const scores: PgScore[] = await scoreService.getScoresByStudentId(student.id);
            const definitivas = scores.map(s => s.notadefinitiva).filter(n => typeof n === "number");
            const promedio = definitivas.length > 0
                ? definitivas.reduce((a, b) => a + b, 0) / definitivas.length
                : 0;
            studentPromedios.push({ student, promedio });
        }

        // 2. Rankear estudiantes por promedio (mayor a menor)
        studentPromedios.sort((a, b) => b.promedio - a.promedio);

        // 3. Generar los boletines PDF con puesto y observación individual
        const pdfBuffers: { filename: string; buffer: Buffer }[] = [];
        for (let i = 0; i < studentPromedios.length; i++) {
            const { student } = studentPromedios[i];
            const puesto = i + 1;

            // Buscar la observación personalizada para este estudiante
            const obsObj = observaciones.find(o => o.id_student === student.id);
            const obse = obsObj ? obsObj.obse : "";

            // Generar el boletín DTO con puesto y observación
            const boletin = await this.getBoletinByStudentId(student.id, obse);
            if (!boletin) continue;
            boletin.puesto = puesto;

            // Seleccionar plantilla según grado
            const templateFile = ['1','2','3','4','5','6', '7', '8', '9'].includes(boletin.grado)
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
                filename: `boletin-${student.nombres_apellidos.replace(/ /g, "_")}-puesto${puesto}.pdf`,
                buffer: Buffer.from(pdfBuffer)
            });
        }

        return pdfBuffers;
    }
}