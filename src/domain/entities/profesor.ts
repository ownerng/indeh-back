import { User, UserRole } from "./user";

export class Profesor extends User{
    constructor(
        public readonly id: number,
        public username: string,
        public password: string
    ){
        super(id, username, password, UserRole.PROFESOR);
    }
}