export class Subject {
    constructor(
        public readonly id: string,
        public nombre: string,
        public estado: "Activo" | "Inactivo",
        public fecha_creacion: Date,
        public fecha_modificacion: Date,
    ) {}
}