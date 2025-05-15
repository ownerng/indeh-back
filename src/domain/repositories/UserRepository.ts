import { User } from "../entities/user";

export interface UserRepository {
    login(username: string, password: string): Promise<User>;
}