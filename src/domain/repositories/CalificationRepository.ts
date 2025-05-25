import { CreateCalificationCorte1DTO, CreateCalificationCorte2DTO, CreateCalificationCorte3DTO, CreateCalificationDTO } from "../../app/dtos/CreateCalificationDTO";
import { Calification } from "../entities/calification";

export interface CalificationRepository {
    createCorte1(calification: CreateCalificationCorte1DTO): Promise<Calification>;
    createCorte2(calification: CreateCalificationCorte2DTO): Promise<Calification>;
    createCorte3(calification: CreateCalificationCorte3DTO): Promise<Calification>;
    getCalificationByStudentId(studentId: string): Promise<Calification[]>;
}