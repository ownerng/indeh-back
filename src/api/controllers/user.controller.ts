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

  async listProfesores(req: Request, res: Response): Promise<void> {
    try {
      const profesores = await userService.getUsersByRole(UserRole.PROFESOR);
      res.status(200).json(profesores);
    } catch (error) {
      console.error("Error al listar profesores:", error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }

  async listAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error al listar usuarios:", error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }

  async updateUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = parseInt(id);
    const { username, role } = req.body;
    if (isNaN(userId)) {
      console.error("Error: ID de score no válido.");
      return res.status(400).json({ message: 'ID de score no válido.' });
    }
    try {
      const users = await userService.updateUserById(userId, username, role);
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error al actualizar usuarios:", error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      console.error("Error: ID de score no válido.");
      return res.status(400).json({ message: 'ID de score no válido.' });
    }
    try {
      const users = await userService.getUserById(userId);
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error al listar profesores:", error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }

  async deleteUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      console.error("Error: ID de score no válido.");
      return res.status(400).json({ message: 'ID de score no válido.' });
    }
    try {
      const users = await userService.deleteUserById(userId);
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error al listar profesores:", error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}