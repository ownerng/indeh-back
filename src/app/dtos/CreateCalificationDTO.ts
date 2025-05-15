export interface CreateCalificationDTO {
        id_student: string,
        id_subject: string,
        calificacion: number | null,
        fecha_creacion: Date,
        fecha_modificacion: Date | null,
}