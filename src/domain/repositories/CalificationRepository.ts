import { CreateCalificationDTO } from "../../app/dtos/CreateCalificationDTO";
import { Calification } from "../entities/calification";

export interface CalificationRepository {
    createCalification(calification: CreateCalificationDTO): Promise<Calification>;
    getCalificationsByStudentId(studentId: string): Promise<Calification[]>;
    updateCalification(calificationId: number, calification: Partial<Calification>): Promise<Calification>;
    updateAllCalificationsByStudentId(studentId: string, updates: CalificationUpdateData[]): Promise<Calification[]>;
}