import { AppDataSource } from "../config/data-source";
import { JWT_SECRET } from "../config/jwt.config";
import { PgUser } from "../entities/PgUser";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export class AuthService {
  private userRepository = AppDataSource.getRepository(PgUser);

  async login(username: string, passwordInput: string): Promise<{ token: string, id: number, role: string } | null> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(passwordInput, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '48h' });

    return {
      token,
      id: user.id,
      role: user.role,
    };
  }
}