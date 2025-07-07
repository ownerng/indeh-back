import { AppDataSource } from "../config/data-source";
import { PgCiclo } from "../entities/PgCiclo";

export class CicloService {
    private cicloRepository = AppDataSource.getRepository(PgCiclo);

    async createCiclo(nombre: string): Promise<PgCiclo> {
            const ciclo = this.toPgCiclo(nombre);
            return await this.cicloRepository.save(ciclo);
        }

    async getAllCiclos(): Promise<PgCiclo[] | null> {
        return await this.cicloRepository.find();
    }

    toPgCiclo(nombre: string): PgCiclo{
        const newCiclo = new PgCiclo();

        newCiclo.nombre_ciclo = nombre;

        return newCiclo

    }
}