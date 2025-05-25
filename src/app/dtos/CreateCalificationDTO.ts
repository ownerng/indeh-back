export interface CreateCalificationDTO {
        id_student: string,
        id_subject: string,
        corte1: number | null,
        corte2: number | null,
        corte3: number | null,
        definitiva: number | null,
        fecha_creacion: Date,
        fecha_modificacion: Date | null,
}