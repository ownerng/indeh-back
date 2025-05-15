import { User } from "../../../domain/entities/user";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppDataSource } from "../DataSource";
import { PgUser } from "../models/PgUser";

export class PgUserRepository implements UserRepository {
    private userRepository = AppDataSource.getRepository(PgUser);

    async login(username: string, password: string): Promise<User> {
        const pgUser = await this.userRepository.findOne({
            where: { username, password },
        });

        if (!pgUser) {
            throw new Error("Invalid username or password");
        }

        return this.toDomainEntity(pgUser);
    }

    private toDomainEntity(pgUser: PgUser): User {
        return new User(pgUser.id, pgUser.username, pgUser.password);
    }
}