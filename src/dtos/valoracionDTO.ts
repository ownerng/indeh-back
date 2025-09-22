export interface PeriodoNota {
    nota: number;
    porcentaje: number;
}

export interface EstudianteValoracion {
    numero: number;
    nombre: string;
    grado: string;
    primer_periodo: PeriodoNota;
    segundo_periodo: PeriodoNota;
    tercer_periodo: PeriodoNota;
    cuarto_periodo: PeriodoNota;
    quinto_periodo: PeriodoNota;
    sexto_periodo: PeriodoNota;
    nota_final_semestre: number;
}

export interface ValoracionDTO {
    area: string;
    profesor: string;
    ciclo: string;
    jornada: string;
    semestre: string;
    grados: string;
    year: string;
    estudiantes: EstudianteValoracion[];
}