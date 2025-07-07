import { AppDataSource } from "../config/data-source";
import { PgBoletin } from "../entities/PgBoletin";
import { PgStudent } from "../entities/PgStudent";
import { boletinDTO } from "../dtos/boletinDTO";

export class BoletinService {
    private boletinRepository = AppDataSource.getRepository(PgBoletin);

    // Crear un boletín para un estudiante
    async createBoletin(student: PgStudent, dto: boletinDTO): Promise<PgBoletin> {
        const boletin = this.toPgBoletin(student, dto);
        return await this.boletinRepository.save(boletin);
    }

    // Consultar todos los boletines de un estudiante por id_student
    async getBoletinesByStudentId(id_student: number): Promise<boletinDTO[]> {
        const boletines = await this.boletinRepository.find({
            where: { id_student: { id: id_student } },
            order: { fecha_creacion: "DESC" },
            relations: {
                id_student: true
            }
        });
        return boletines.map(b => this.toBoletinDTO(b));
    }

    // Consultar el último boletín de un estudiante
    async getLastBoletinByStudentId(id_student: number): Promise<boletinDTO | null> {
        const boletin = await this.boletinRepository.findOne({
            where: { id_student: { id: id_student } },
            order: { fecha_creacion: "DESC" },
            relations: {
                id_student: true
            }
        });
        return boletin ? this.toBoletinDTO(boletin) : null;
    }

    // Convertir de DTO a entidad
    toPgBoletin(student: PgStudent, dto: boletinDTO): PgBoletin {
        const boletin = new PgBoletin();

        boletin.id_student = {id: student.id} as PgStudent;
        boletin.state = dto.state;
        boletin.puesto = dto.puesto;

        // Materias y promedios
        Object.assign(boletin, dto);

        return boletin;
    }

    // Convertir de entidad a DTO
    toBoletinDTO(boletin: PgBoletin): boletinDTO {
        const student = boletin.id_student as PgStudent;
        return {
            fecha_creacion: boletin.fecha_creacion.toISOString().split("T")[0],
            nombres_apellidos: student.nombres_apellidos,
            grado: student.grado,
            ciclo: "", // Calcula el ciclo si lo necesitas
            jornada: student.jornada,
            state: boletin.state,
            puesto: boletin.puesto,

            // Castellano
            castellano_corte1: boletin.castellano_corte1,
            castellano_corte2: boletin.castellano_corte2,
            castellano_corte3: boletin.castellano_corte3,
            castellano_desem1: boletin.castellano_desem1,
            castellano_desem2: boletin.castellano_desem2,
            castellano_desem3: boletin.castellano_desem3,
            castellano_porcentual1: boletin.castellano_porcentual1,
            castellano_porcentual2: boletin.castellano_porcentual2,
            castellano_porcentual3: boletin.castellano_porcentual3,
            castellano_def: boletin.castellano_def,
            castellano_obs: boletin.castellano_obs,

            // Sociales
            sociales_corte1: boletin.sociales_corte1,
            sociales_corte2: boletin.sociales_corte2,
            sociales_corte3: boletin.sociales_corte3,
            sociales_desem1: boletin.sociales_desem1,
            sociales_desem2: boletin.sociales_desem2,
            sociales_desem3: boletin.sociales_desem3,
            sociales_porcentual1: boletin.sociales_porcentual1,
            sociales_porcentual2: boletin.sociales_porcentual2,
            sociales_porcentual3: boletin.sociales_porcentual3,
            sociales_def: boletin.sociales_def,
            sociales_obs: boletin.sociales_obs,

            // Biología
            biologia_corte1: boletin.biologia_corte1,
            biologia_corte2: boletin.biologia_corte2,
            biologia_corte3: boletin.biologia_corte3,
            biologia_desem1: boletin.biologia_desem1,
            biologia_desem2: boletin.biologia_desem2,
            biologia_desem3: boletin.biologia_desem3,
            biologia_porcentual1: boletin.biologia_porcentual1,
            biologia_porcentual2: boletin.biologia_porcentual2,
            biologia_porcentual3: boletin.biologia_porcentual3,
            biologia_def: boletin.biologia_def,
            biologia_obs: boletin.biologia_obs,

            // Inglés
            ingles_corte1: boletin.ingles_corte1,
            ingles_corte2: boletin.ingles_corte2,
            ingles_corte3: boletin.ingles_corte3,
            ingles_desem1: boletin.ingles_desem1,
            ingles_desem2: boletin.ingles_desem2,
            ingles_desem3: boletin.ingles_desem3,
            ingles_porcentual1: boletin.ingles_porcentual1,
            ingles_porcentual2: boletin.ingles_porcentual2,
            ingles_porcentual3: boletin.ingles_porcentual3,
            ingles_def: boletin.ingles_def,
            ingles_obs: boletin.ingles_obs,

            // Química
            quimica_corte1: boletin.quimica_corte1,
            quimica_corte2: boletin.quimica_corte2,
            quimica_corte3: boletin.quimica_corte3,
            quimica_desem1: boletin.quimica_desem1,
            quimica_desem2: boletin.quimica_desem2,
            quimica_desem3: boletin.quimica_desem3,
            quimica_porcentual1: boletin.quimica_porcentual1,
            quimica_porcentual2: boletin.quimica_porcentual2,
            quimica_porcentual3: boletin.quimica_porcentual3,
            quimica_def: boletin.quimica_def,
            quimica_obs: boletin.quimica_obs,

            // Física
            fisica_corte1: boletin.fisica_corte1,
            fisica_corte2: boletin.fisica_corte2,
            fisica_corte3: boletin.fisica_corte3,
            fisica_desem1: boletin.fisica_desem1,
            fisica_desem2: boletin.fisica_desem2,
            fisica_desem3: boletin.fisica_desem3,
            fisica_porcentual1: boletin.fisica_porcentual1,
            fisica_porcentual2: boletin.fisica_porcentual2,
            fisica_porcentual3: boletin.fisica_porcentual3,
            fisica_def: boletin.fisica_def,
            fisica_obs: boletin.fisica_obs,

            // Matemáticas
            matematicas_corte1: boletin.matematicas_corte1,
            matematicas_corte2: boletin.matematicas_corte2,
            matematicas_corte3: boletin.matematicas_corte3,
            matematicas_desem1: boletin.matematicas_desem1,
            matematicas_desem2: boletin.matematicas_desem2,
            matematicas_desem3: boletin.matematicas_desem3,
            matematicas_porcentual1: boletin.matematicas_porcentual1,
            matematicas_porcentual2: boletin.matematicas_porcentual2,
            matematicas_porcentual3: boletin.matematicas_porcentual3,
            matematicas_def: boletin.matematicas_def,
            matematicas_obs: boletin.matematicas_obs,

            // Emprendimiento
            emprendimiento_corte1: boletin.emprendimiento_corte1,
            emprendimiento_corte2: boletin.emprendimiento_corte2,
            emprendimiento_corte3: boletin.emprendimiento_corte3,
            emprendimiento_desem1: boletin.emprendimiento_desem1,
            emprendimiento_desem2: boletin.emprendimiento_desem2,
            emprendimiento_desem3: boletin.emprendimiento_desem3,
            emprendimiento_porcentual1: boletin.emprendimiento_porcentual1,
            emprendimiento_porcentual2: boletin.emprendimiento_porcentual2,
            emprendimiento_porcentual3: boletin.emprendimiento_porcentual3,
            emprendimiento_def: boletin.emprendimiento_def,
            emprendimiento_obs: boletin.emprendimiento_obs,

            // Filosofía
            filosofia_corte1: boletin.filosofia_corte1,
            filosofia_corte2: boletin.filosofia_corte2,
            filosofia_corte3: boletin.filosofia_corte3,
            filosofia_desem1: boletin.filosofia_desem1,
            filosofia_desem2: boletin.filosofia_desem2,
            filosofia_desem3: boletin.filosofia_desem3,
            filosofia_porcentual1: boletin.filosofia_porcentual1,
            filosofia_porcentual2: boletin.filosofia_porcentual2,
            filosofia_porcentual3: boletin.filosofia_porcentual3,
            filosofia_def: boletin.filosofia_def,
            filosofia_obs: boletin.filosofia_obs,

            // Ética y religión
            etica_religion_corte1: boletin.etica_religion_corte1,
            etica_religion_corte2: boletin.etica_religion_corte2,
            etica_religion_corte3: boletin.etica_religion_corte3,
            etica_religion_desem1: boletin.etica_religion_desem1,
            etica_religion_desem2: boletin.etica_religion_desem2,
            etica_religion_desem3: boletin.etica_religion_desem3,
            etica_religion_porcentual1: boletin.etica_religion_porcentual1,
            etica_religion_porcentual2: boletin.etica_religion_porcentual2,
            etica_religion_porcentual3: boletin.etica_religion_porcentual3,
            etica_religion_def: boletin.etica_religion_def,
            etica_religion_obs: boletin.etica_religion_obs,

            // Informática
            informatica_corte1: boletin.informatica_corte1,
            informatica_corte2: boletin.informatica_corte2,
            informatica_corte3: boletin.informatica_corte3,
            informatica_desem1: boletin.informatica_desem1,
            informatica_desem2: boletin.informatica_desem2,
            informatica_desem3: boletin.informatica_desem3,
            informatica_porcentual1: boletin.informatica_porcentual1,
            informatica_porcentual2: boletin.informatica_porcentual2,
            informatica_porcentual3: boletin.informatica_porcentual3,
            informatica_def: boletin.informatica_def,
            informatica_obs: boletin.informatica_obs,

            // Educación física
            ed_fisica_corte1: boletin.ed_fisica_corte1,
            ed_fisica_corte2: boletin.ed_fisica_corte2,
            ed_fisica_corte3: boletin.ed_fisica_corte3,
            ed_fisica_desem1: boletin.ed_fisica_desem1,
            ed_fisica_desem2: boletin.ed_fisica_desem2,
            ed_fisica_desem3: boletin.ed_fisica_desem3,
            ed_fisica_porcentual1: boletin.ed_fisica_porcentual1,
            ed_fisica_porcentual2: boletin.ed_fisica_porcentual2,
            ed_fisica_porcentual3: boletin.ed_fisica_porcentual3,
            ed_fisica_def: boletin.ed_fisica_def,
            ed_fisica_obs: boletin.ed_fisica_obs,

            // Comportamiento
            comportamiento_corte1: boletin.comportamiento_corte1,
            comportamiento_corte2: boletin.comportamiento_corte2,
            comportamiento_corte3: boletin.comportamiento_corte3,
            comportamiento_desem1: boletin.comportamiento_desem1,
            comportamiento_desem2: boletin.comportamiento_desem2,
            comportamiento_desem3: boletin.comportamiento_desem3,
            comportamiento_porcentual1: boletin.comportamiento_porcentual1,
            comportamiento_porcentual2: boletin.comportamiento_porcentual2,
            comportamiento_porcentual3: boletin.comportamiento_porcentual3,
            comportamiento_def: boletin.comportamiento_def,
            comportamiento_obs: boletin.comportamiento_obs,

            // Promedios y observaciones generales
            promedio_corte1: boletin.promedio_corte1,
            promedio_corte2: boletin.promedio_corte2,
            promedio_corte3: boletin.promedio_corte3,
            obs: boletin.obs ?? "",
        };
    }
}