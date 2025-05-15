export class Calification {
    constructor(
        public readonly id: number,
        public id_student: string,
        public id_subject: string,
        public calificacion: number | null,
        public fecha_creacion: Date,
        public fecha_modificacion: Date | null,
    ) {}
}