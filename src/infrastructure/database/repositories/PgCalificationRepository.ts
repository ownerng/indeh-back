import { In } from "typeorm";
import { Calification } from "../../../domain/entities/calification";
import { CalificationRepository } from "../../../domain/repositories/CalificationRepository";
import { AppDataSource } from "../DataSource";
import { PgCalification } from "../models/PgCalification";
import { PgStudent } from "../models/PgStudent"; // Required for setting relation
import { PgSubject } from "../models/PgSubject"; // Required for setting relation

export class PgCalificationRepository implements CalificationRepository {
    private calificationRepository = AppDataSource.getRepository(PgCalification);

    async createCalification(calification: Calification): Promise<Calification> {
        const pgCalification = this.toPgEntity(calification);
        const savedPgCalification = await this.calificationRepository.save(pgCalification);
        return this.toDomainEntity(savedPgCalification);
    }

    async getCalificationsByStudentId(studentId: string): Promise<Calification[]> {
        const pgCalifications = await this.calificationRepository.find({
            where: { id_student: studentId },
            relations: ["subject"]
        });
        return pgCalifications.map(pgCal => this.toDomainEntity(pgCal));
    }

    async updateCalification(calificationId: number, calification: Partial<Calification>): Promise<Calification> {
        const pgCalification = await this.calificationRepository.findOne({
            where: { id: calificationId },
            relations: ["student", "subject"]
        });

        if (!pgCalification) {
            throw new Error("Calification not found");
        }

        Object.assign(pgCalification, calification);
        const updatedPgCalification = await this.calificationRepository.save(pgCalification);
        return this.toDomainEntity(updatedPgCalification);
    }

async updateAllCalificationsByStudentId(studentId: string, updates: CalificationUpdateData[]): Promise<Calification[]> {
    const calificationIdsToUpdate = updates.map(update => update.id);

    // Si no hay IDs para actualizar, no hagas nada y devuelve un array vacío o lanza un error si prefieres
    if (calificationIdsToUpdate.length === 0) {
        return []; // O throw new Error("No calification IDs provided for update");
    }
  const pgCalifications = await this.calificationRepository.find({
        where: {
            id_student: studentId,
            id: In(calificationIdsToUpdate) // Usamos 'In' de TypeORM para buscar por múltiples IDs
        },
        relations: ["student", "subject"]
    });
   if (!pgCalifications || pgCalifications.length === 0) {
         // Puedes lanzar un error genérico o uno más específico si ningún ID coincidió
         throw new Error(`No matching califications found for student ${studentId} with provided IDs.`);
         // O simplemente devolver un array vacío si consideras que no es un error grave
         // return [];
    }

    // 4. Crear un mapa para buscar rápidamente los datos de actualización por ID
    const updatesMap = new Map<number, CalificationUpdateData>(); // Usa el tipo correcto para la clave (number/string)
    updates.forEach(update => {
        updatesMap.set(update.id, update);
    });

   const updatedPgCalifications: PgCalification[] = [];
    for (const pgCal of pgCalifications) {
        const updateData = updatesMap.get(pgCal.id); // Busca los datos de actualización para esta calificación específica

        if (updateData) { // Si encontramos datos de actualización para este ID
           pgCal.corte1 = updateData.calificacion;

            updatedPgCalifications.push(pgCal); // Añade la calificación modificada al array para guardar
        }
        // Nota: Si un ID estaba en el input 'updates' pero no se encontró en la base de datos para este estudiante,
        // simplemente se ignora y no se intenta actualizar.
    }
    await this.calificationRepository.save(updatedPgCalifications);

    // 7. Convertir a entidad de dominio y devolver el resultado
    return updatedPgCalifications.map(pgCal => this.toDomainEntity(pgCal));
}

    private toDomainEntity(pgCalification: PgCalification): Calification {
        return new Calification(
            pgCalification.id,
            pgCalification.id_student,
            pgCalification.id_subject,
            pgCalification.corte1,
            pgCalification.corte2,
            pgCalification.corte3,
            pgCalification.definitiva,
            pgCalification.fecha_creacion,
            pgCalification.fecha_modificacion
        );
    }

    private toPgEntity(calification: Calification): PgCalification {
        const pgCalification = new PgCalification();
        pgCalification.id = calification.id;
        pgCalification.corte1 = calification.corte1;
        pgCalification.corte2 = calification.corte2;
        pgCalification.corte3 = calification.corte3;
        pgCalification.definitiva = calification.definitiva;
        pgCalification.fecha_creacion = calification.fecha_creacion;
        pgCalification.fecha_modificacion = calification.fecha_modificacion;
        pgCalification.student = { id: calification.id_student } as PgStudent;
        pgCalification.subject = { id: calification.id_subject } as PgSubject;
        return pgCalification;
    }
}