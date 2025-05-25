import { AppDataSource } from "../config/data-source";
import { JWT_SECRET } from "../config/jwt.config";
import { PgUser } from "../entities/PgUser";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export class AuthService {
  private userRepository = AppDataSource.getRepository(PgUser);

  async login(username: string, passwordInput: string): Promise<string | null> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      return null; // Usuario no encontrado
    }

    const isPasswordValid = await bcrypt.compare(passwordInput, user.password);
    if (!isPasswordValid) {
      return null; // Contraseña incorrecta
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    return jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Token expira en 1 hora
  }
}