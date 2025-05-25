import { Request, Response } from "express";
import { StudentService } from "../../services/student.service";

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
}
