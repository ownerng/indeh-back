import { LargeNumberLike } from "node:crypto";
import { Calification } from "../../domain/entities/calification";
import { CalificationRepository } from "../../domain/repositories/CalificationRepository";


export class GetCalificationsByStudentIdUseCase {
    constructor(private calificationRepository: CalificationRepository) {}

    async execute(studentId: string): Promise<Calification[]> {
        const califications = await this.calificationRepository.getCalificationsByStudentId(studentId);
        if (!califications || califications.length === 0) {
            throw new Error("No califications found for this student");
        }
        return califications;
    }
}

export class UpdateCalificationUseCase {
    constructor(private calificationRepository: CalificationRepository) {}

    async execute(calificationId: number, calificationData: Partial<Calification>): Promise<Calification> {
        const updatedCalification = await this.calificationRepository.updateCalification(calificationId, calificationData);
        if (!updatedCalification) {
            throw new Error("Calification not found");
        }
        return updatedCalification;
    }
}

export class UpdateAllCalificationsByStudentIdUseCase {
    constructor(private calificationRepository: CalificationRepository) {}

    async execute(studentId: string, updates: CalificationUpdateData[]): Promise<Calification[]> {
        const updatedCalifications = await this.calificationRepository.updateAllCalificationsByStudentId(studentId, updates);
        if (!updatedCalifications || updatedCalifications.length === 0) {
            throw new Error("No califications found for this student");
        }
        return updatedCalifications;
    }
}