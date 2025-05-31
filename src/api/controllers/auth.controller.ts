import { AuthService } from "../../services/auth.service";
import { Request, Response } from 'express';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos.' });
      return;
    }

    try {
      const token = await authService.login(username, password);
      if (!token) {
        res.status(401).json({ message: 'Credenciales inválidas.' });
        return;
      }
      res.status(200).json(token);
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}