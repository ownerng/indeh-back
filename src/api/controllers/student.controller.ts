import { Request, Response } from "express";
import { StudentService } from "../../services/student.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { UserRole } from "../../entities/UserRole";

const studentService = new StudentService();

export class StudentController {
    async createStudent(req: Request, res: Response): Promise<void> {
        const studentData = req.body;

        try {
            const newStudent = await studentService.createStudent(studentData);
            res.status(201).json(newStudent);
        } catch (error) {
            console.error("Error al crear estudiante:", error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async getAllStudents(req: Request, res: Response): Promise<void> {
        try {
            const students = await studentService.getAllStudents();
            res.status(200).json(students);
        } catch (error) {
            console.error("Error al obtener estudiantes:", error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async getStudentsByProfessorId(req: AuthenticatedRequest, res: Response): Promise<Response> {
        if (!req.user || req.user.role !== UserRole.PROFESOR) {
            return res.status(403).json({ message: 'Acceso denegado. Solo los profesores pueden acceder a esta información.' });
        }
        try {
            const students = await studentService.getStudentsByProfessorId(req.user.userId);
            return res.status(200).json(students);
        } catch (error) {
            console.error("Error al obtener estudiantes por ID de profesor:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}
