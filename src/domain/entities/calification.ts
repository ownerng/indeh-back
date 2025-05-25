export class Calification {
    constructor(
        public readonly id: number,
        public id_student: string,
        public id_subject: string,
        public corte1: number | null,
        public corte2: number | null,
        public corte3: number | null,
        public definitiva: number | null,
        public fecha_creacion: Date,
        public fecha_modificacion: Date | null,
    ) {}
}