import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/UserRepository";

export class LoginUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(username: string, password: string): Promise<User> {
        const user = await this.userRepository.login(username, password);
        if (!user) {
            throw new Error("Invalid username or password");
        }
        return user;
    }
}