export const porcentual = (nota: number, prc: number) => {
    const porcentual = nota * prc;
    return Math.floor(porcentual * 100) / 100;
}

export const ciclo = (fecha: Date) => {
    const mes = fecha.getMonth() + 1; // getMonth() es 0-indexado
    const año = fecha.getFullYear();
    if (mes < 7) {
        return `${año}-1`;
    } else {
        return `${año}-2`;
    }
}
export const obs  =(nota: number) => {
    if(nota > 0 && nota <= 2.9) {
        return 'HABILITA';
    } else {
        return '';
    }
}

export const stateStudent = (subjectLose: number) => {
    if(subjectLose >= 6) {
        return 'REPROBADO';
    } else if ( subjectLose < 6 && subjectLose > 0){
        return 'DEBE HABILITAR';
    } else {
        return 'APROBADO'
    }
}
export const desem = (nota: number) => {
    if(nota >= 1 && nota <= 2.9) {
        return 'Bajo';
    } else if(nota >= 3 && nota <= 3.9) {
        return 'Basico';
    } else if(nota >= 4 && nota <= 4.5) {
        return 'Alto';
    } else if(nota > 4.5 && nota <= 5) {
        return 'Superior';
    } else {
        return 'No evaluado';
    }
}