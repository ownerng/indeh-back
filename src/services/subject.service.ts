import { AppDataSource } from "../config/data-source";
import { CreateSubjectDTO } from "../dtos/createSubjectDTO";
import { PgSubject } from "../entities/PgSubject";
import { PgUser } from "../entities/PgUser";
import { Jornada } from "../entities/Jornada";

export class SubjectService {
    private subjectRepository = AppDataSource.getRepository(PgSubject);

    async createSubject(data: CreateSubjectDTO): Promise<PgSubject> {
        const newSubject = this.subjectRepository.create(this.toPgSubject(data));
        await this.subjectRepository.save(newSubject);
        return newSubject;
    }

    async getAllSubjects(): Promise<(Omit<PgSubject, 'profesor'> & { profesor?: Omit<PgUser, 'password'> })[]> {
        const subjects = await this.subjectRepository.find({
            relations: {
                profesor: true,
            },
        });

        return subjects.map(subject => {
            if (subject.profesor) {
                const { password, ...profesorWithoutPassword } = subject.profesor as PgUser;
                return {
                    ...subject,
                    profesor: profesorWithoutPassword,
                };
            } else {
                const { profesor, ...subjectWithoutProfesor } = subject;
                return subjectWithoutProfesor;
            }
        });
    }

    async getSubjectById(id: number): Promise<(Omit<PgSubject, 'profesor'> & { profesor: Omit<PgUser, 'password'> | null }) | null> {
        const subject = await this.subjectRepository.findOne({
            where: { id },
            relations: { profesor: true },
        });

        if (!subject) {
            return null;
        }

        if (subject.profesor) {
            const { password, ...profesorWithoutPassword } = subject.profesor as PgUser;
            return {
                ...subject,
                profesor: profesorWithoutPassword,
            };
        } else {
            return {
                ...subject,
                profesor: null,
            };
        }
    }

    async deleteSubjectById(id: number): Promise<PgSubject | null > {
        const subject = await this.subjectRepository.findOneBy({id: id});
        if(!subject){
            return null;
        }
        return await this.subjectRepository.remove(subject);
    }

    async updateSubjects(id: number, data: CreateSubjectDTO): Promise<PgSubject | null> {
        const updateSubject = await this.subjectRepository.findOneBy({id: id});
        if(!updateSubject){
            return null;
        }
        updateSubject.nombre = data.nombre;
        updateSubject.profesor = { id: data.id_profesor} as PgUser;

        return await this.subjectRepository.save(updateSubject);
    }

    async getSubjectsIdsByProfessorId(professorId: number): Promise<{id: number; nombre: string; jornada: Jornada, ciclo: string | null}[]> {
        const subjects = await this.subjectRepository.find({
            where: {
                profesor: { id: professorId },
            },
            select: ["id", "nombre", "jornada"],
            relations: {
                profesor: true
            }
        });
        return subjects.map(subject => ({
            id: subject.id,
            nombre: subject.nombre,
            jornada: subject.jornada,
            ciclo: subject.ciclo
        }));
    }

    /**
     * Inicializa las materias por jornada solo si no existen previamente.
     * Similar a createInitialAdminUser en user.service.ts
     */
    async initializeSubjects(): Promise<void> {
        const subjectNames = [
            "castellano",
            "ingles",
            "quimica",
            "fisica",
            "biologia",
            "sociales",
            "matematicas",
            "emprendimiento",
            "filosofia",
            "etica y religion",
            "informatica",
            "educacion fisica",
            "comportamiento"
        ];

        const jornadas = Object.values(Jornada);

        try {
            // Traer todas las materias existentes
            const existingSubjects = await this.subjectRepository.find();
            const existingSet = new Set(
                existingSubjects.map(s => `${s.nombre.toLowerCase()}-${s.jornada}`)
            );

            const subjectsToCreate: PgSubject[] = [];

            for (const jornada of jornadas) {
                for (const nombre of subjectNames) {
                    const key = `${nombre.toLowerCase()}-${jornada}`;
                    if (!existingSet.has(key)) {
                        const subject = new PgSubject();
                        subject.nombre = nombre;
                        subject.jornada = jornada as Jornada;
                        subject.profesor = null;
                        subject.fecha_creacion = new Date();
                        subjectsToCreate.push(subject);
                    }
                }
            }

            if (subjectsToCreate.length > 0) {
                await this.subjectRepository.save(subjectsToCreate);
                console.log("Materias faltantes creadas correctamente.");
            } else {
                console.log("Todas las materias requeridas ya existen.");
            }
        } catch (error) {
            console.error("Error al inicializar las materias:", error);
        }
    }

    /**
     * Crea las materias del ciclo indicado para todas las jornadas, solo si no existen previamente.
     * Recibe el ciclo como string (por ejemplo, "2025-2").
     */
    async createSubjectsForNewCiclo(ciclo: string): Promise<void> {
        const subjectNames = [
            "castellano",
            "ingles",
            "quimica",
            "fisica",
            "biologia",
            "sociales",
            "matematicas",
            "emprendimiento",
            "filosofia",
            "etica y religion",
            "informatica",
            "educacion fisica",
            "comportamiento"
        ];

        const jornadas = Object.values(Jornada);

        try {
            // Traer todas las materias existentes para ese ciclo
            const existingSubjects = await this.subjectRepository.find({
                where: { ciclo }
            });
            const existingSet = new Set(
                existingSubjects.map(s => `${s.nombre.toLowerCase()}-${s.jornada}`)
            );

            const subjectsToCreate: PgSubject[] = [];

            for (const jornada of jornadas) {
                for (const nombre of subjectNames) {
                    const key = `${nombre.toLowerCase()}-${jornada}`;
                    if (!existingSet.has(key)) {
                        const subject = new PgSubject();
                        subject.nombre = nombre;
                        subject.jornada = jornada as Jornada;
                        subject.profesor = null;
                        subject.fecha_creacion = new Date();
                        subject.ciclo = ciclo;
                        subjectsToCreate.push(subject);
                    }
                }
            }

            if (subjectsToCreate.length > 0) {
                await this.subjectRepository.save(subjectsToCreate);
                console.log(`Materias del ciclo ${ciclo} creadas correctamente.`);
            } else {
                console.log(`Todas las materias requeridas para el ciclo ${ciclo} ya existen.`);
            }
        } catch (error) {
            console.error(`Error al crear materias para el ciclo ${ciclo}:`, error);
        }
    }

    private toPgSubject(subject: CreateSubjectDTO): PgSubject {
        const pgSubject = new PgSubject();
        pgSubject.nombre = subject.nombre;
        pgSubject.profesor = { id: subject.id_profesor } as PgUser;
        pgSubject.fecha_creacion = new Date();
        return pgSubject;
    }
}