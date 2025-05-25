export class User {
    constructor(
        public readonly id: number,
        public username: string,
        public password: string,
        public rol: UserRole,
    ){}
}


export enum UserRole {
    EJECUTIVO = 'ejecutivo',
    PROFESOR = 'profesor',
}