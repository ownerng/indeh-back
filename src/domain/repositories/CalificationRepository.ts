import { Calification } from "../entities/calification";

export interface CalificationRepository {
    createCalification(calification: Calification): Promise<Calification>;
    getCalificationsByStudentId(studentId: string): Promise<Calification[]>;
    updateCalification(calificationId: number, calification: Partial<Calification>): Promise<Calification>;
    updateAllCalificationsByStudentId(studentId: string, updates: CalificationUpdateData[]): Promise<Calification[]>;
}