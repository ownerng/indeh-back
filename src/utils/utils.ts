export const porcentual = (nota: number, prc: number) => {
    const porcentual = nota * prc;
    return Math.floor(porcentual * 100) / 100;
}

export const ciclo = (grado: string) => {
    if(grado === '10' || grado === '11') {
        return 'CICLO II ED. MEDIA';
    }
    else {
        return 'CICLO I ED. BASICA';
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