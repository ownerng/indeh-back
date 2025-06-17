import { AppDataSource } from "../config/data-source";
import { PgUser } from "../entities/PgUser";
import { UserRole } from "../entities/UserRole";
import bcrypt from 'bcrypt';

export class UserService {
  private userRepository = AppDataSource.getRepository(PgUser);

  async createUser(username: string, passwordInput: string, role: UserRole): Promise<Omit<PgUser, 'password'> | null> {
    const existingUser = await this.userRepository.findOneBy({ username });
    if (existingUser) {
      throw new Error('El nombre de usuario ya existe.');
    }

    const hashedPassword = await bcrypt.hash(passwordInput, 10); // 10 salt rounds

    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
    });

    await this.userRepository.save(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  async getAllUsers(): Promise<PgUser[] | null> {
    return await this.userRepository.find()
  }
  async getUserById(id: number): Promise<Omit<PgUser, 'password'> | null> {
    return await this.userRepository.findOneBy({ id: id });
  }
  async updateUserById(id: number, username: string, role: UserRole, password: string): Promise<Omit<PgUser, 'password'> | null> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      return null;
    }
    user.username = username;
    user.role = role;
    user.password = password;
    return await this.userRepository.save(user);
  }
  async deleteUserById(id: number): Promise<PgUser | null> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      return null;
    }
    return await this.userRepository.remove(user);
  }
  async findUserByUsername(username: string): Promise<PgUser | null> {
    return this.userRepository.findOneBy({ username });
  }

  async getUsersByRole(role: UserRole): Promise<Omit<PgUser, 'password'>[]> {
    const users = await this.userRepository.find({ where: { role } });
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }

  async createInitialAdminUser(): Promise<void> {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    try {
      const existingAdmin = await this.findUserByUsername(adminUsername);
      if (!existingAdmin) {
        await this.createUser(adminUsername, adminPassword, UserRole.EJECUTIVO);
        console.log(`Usuario ejecutivo inicial '${adminUsername}' creado.`);
      } else {
        console.log(`Usuario ejecutivo inicial '${adminUsername}' ya existe.`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('El nombre de usuario ya existe.')) {
        console.log(`Usuario ejecutivo inicial '${adminUsername}' ya existe (manejado por error de creación).`);
      } else {
        console.error("Error al crear el usuario admin inicial:", error);
      }
    }
  }
}