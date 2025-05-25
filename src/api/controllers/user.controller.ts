import { UserRole } from "../../entities/UserRole";
import { UserService } from "../../services/user.service";
import { Request, Response } from 'express';

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      res.status(400).json({ message: 'Nombre de usuario, contraseña y rol son requeridos.' });
      return;
    }

    if (!Object.values(UserRole).includes(role as UserRole)) {
        res.status(400).json({ message: 'Rol inválido.' });
        return;
    }

    try {
      const newUser = await userService.createUser(username, password, role as UserRole);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof Error && error.message.includes('El nombre de usuario ya existe')) {
        res.status(409).json({ message: error.message }); // 409 Conflict
      } else {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: 'Error interno del servidor.' });
      }
    }
  }
}