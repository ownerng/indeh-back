import { CreateTeacherDTO } from "../../app/dtos/CreateTeacherDTO";
import { Profesor } from "../entities/profesor";
import { User } from "../entities/user";

export interface UserRepository {
    login(username: string, password: string): Promise<User>;
    createTeacher(data: CreateTeacherDTO): Promise<Profesor>;
}