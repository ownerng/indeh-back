import { Request, Response } from "express";
import { StudentService } from "../../services/student.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { UserRole } from "../../entities/UserRole";
import { join } from "path";
import { readFileSync, writeFileSync } from "fs";
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import archiver from "archiver";
import * as stream from "stream";
import { PDFDocument } from 'pdf-lib';

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

    async getStudentById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const studentId = parseInt(id);
        
        if (isNaN(studentId)) {
            console.error("Error: ID de estudiante no válido.");
            return res.status(400).json({ message: 'ID de estudiante no válido.' });
        }
        try {
            const student = await studentService.getStudentById(studentId);
            return res.status(200).json(student);
        } catch (error) {
            console.error("Error al obtener estudiante por ID:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async getStudentByGrade(req: Request, res: Response): Promise<Response> {
        const { grado, jornada } = req.body;
        try {
            const student = await studentService.getStudentsByGrade(grado, jornada);
            return res.status(200).json(student);
        } catch (error) {
            console.error("Error al obtener estudiante por ID:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async updateStudent(req: Request, res: Response): Promise<Response> {
        const studentData = req.body;
        const { id } = req.params;
        const studentId = parseInt(id);
         if (isNaN(studentId)) {
            console.error("Error: ID de estudiante no válido.");
            return res.status(400).json({ message: 'ID de estudiante no válido.' });
        }
        try {
            const updateStudent = await studentService.updateStudents(studentId,studentData);
            return res.status(200).json(updateStudent);
        } catch (error) {
            console.error("Error al actualizar estudiante:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async deleteStudentById(req: Request, res: Response): Promise<Response> {
        const {id } = req.params;
        const studentId = parseInt(id);
         if (isNaN(studentId)) {
            console.error("Error: ID de estudiante no válido.");
            return res.status(400).json({ message: 'ID de estudiante no válido.' });
        }
        try {
            const deleteStudent = await studentService.deleteStudentById(studentId);
            return res.status(200).json(deleteStudent);
        } catch (error) {
            console.error("Error al eliminar estudiante:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
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

    async getBoletinByStudentId(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { grado, jornada, obs, ciclo, is_final } = req.body;
        const studentId = parseInt(id);

        if (isNaN(studentId)) {
            console.error("Error: ID de estudiante no válido.");
            return res.status(400).json({ message: 'ID de estudiante no válido.' });
        }

        try {
            // obse aquí debe ser un objeto Observaciones con id_student y obse
            const boletinPdf = await studentService.getBoletinByGradoWithRankingForStudent(
                grado,
                jornada,
                obs,
                ciclo,
                is_final
            );

            if (!boletinPdf) {
                console.warn(`Boletín no encontrado para el estudiante ID: ${studentId}`);
                return res.status(404).json({ message: 'Boletín no encontrado.' });
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=${boletinPdf.filename}`);
            res.setHeader('Content-Length', boletinPdf.buffer.length.toString());

            return res.status(200).end(boletinPdf.buffer);

        } catch (error) {
            console.error(`Error general al obtener boletín por ID de estudiante ${studentId}:`, error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async updateScoresForStudents(req: Request, res: Response): Promise<Response> {
        try {
            await studentService.updateScoresForStudents();
            return res.status(200).json({ message: 'Scores actualizados correctamente.' });
        } catch (error) {
            console.error("Error al actualizar scores de estudiantes:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async getBoletinesByGrado(req: Request, res: Response): Promise<Response> {
        const { grado, obse, jornada, ciclo, is_final } = req.body; // obse es un array de observaciones individuales

        try {
            const pdfBuffers = await studentService.getBoletinesByGradoWithRanking(grado, jornada, obse, ciclo, is_final);

            const mergedPdf = await PDFDocument.create();
            for (const pdf of pdfBuffers) {
                const pdfDoc = await PDFDocument.load(pdf.buffer);
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const mergedPdfBytes = await mergedPdf.save();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=boletines-grado-${grado}-jornada-${jornada}.pdf`);
            res.setHeader('Content-Length', mergedPdfBytes.length.toString());

            return res.status(200).end(Buffer.from(mergedPdfBytes));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error generando boletines.' });
        }
    }

    async promoverEstudiante(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { grado } = req.body;
        const studentId = parseInt(id);

        if (isNaN(studentId)) {
            console.error("Error: ID de estudiante no válido.");
            return res.status(400).json({ message: 'ID de estudiante no válido.' });
        }

        try {
            const result = await studentService.promoverEstudiante(studentId, grado);
            return res.status(200).json({ message: result });
        } catch (error) {
            console.error("Error al promover estudiante:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async exportAllStudentsToExcel(req: Request, res: Response): Promise<Response> {
        try {
            const excelBuffer = await studentService.exportAllStudentsToExcel();
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=estudiantes.xlsx');
            res.setHeader('Content-Length', excelBuffer.length.toString());
            return res.status(200).end(excelBuffer);
        } catch (error) {
            console.error("Error al exportar estudiantes a Excel:", error);
            return res.status(500).json({ message: 'Error exportando estudiantes a Excel.' });
        }
    }

    async getValoraciones(req: AuthenticatedRequest, res: Response): Promise<Response> {
        console.log('getValoraciones called');
        console.log('User info:', req.user);
        console.log('User role:', req.user?.role);
        console.log('Required role:', UserRole.EJECUTIVO);
        
        if (!req.user || req.user.role !== UserRole.EJECUTIVO) {
            console.log('Access denied - insufficient role');
            return res.status(403).json({ message: 'Acceso denegado. Solo los ejecutivos pueden acceder a esta información.' });
        }
        
        try {
            console.log('Processing valoraciones for executive user:', req.user.userId);
            const valoracionesPdf = await studentService.getValoraciones(req.user.userId);
            
            if (!valoracionesPdf) {
                console.log('No valoraciones found');
                return res.status(404).json({ message: 'No se encontraron valoraciones para generar.' });
            }

            console.log('Valoraciones generated successfully, size:', valoracionesPdf.length);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=valoraciones_todos_profesores.pdf');
            res.setHeader('Content-Length', valoracionesPdf.length.toString());
            
            return res.status(200).end(valoracionesPdf);
        } catch (error) {
            console.error("Error al obtener valoraciones:", error);
            return res.status(500).json({ message: 'Error interno del servidor.', error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }

    async getValoracionesByProfessor(req: AuthenticatedRequest, res: Response): Promise<Response> {
        console.log('getValoracionesByProfessor called');
        if (!req.user || req.user.role !== UserRole.EJECUTIVO) {
            return res.status(403).json({ message: 'Acceso denegado. Solo los ejecutivos pueden acceder a esta información.' });
        }

        const { id } = req.params;
        const professorId = parseInt(id);
        if (isNaN(professorId)) {
            return res.status(400).json({ message: 'ID de profesor no válido.' });
        }

        try {
            console.log('Processing valoraciones for professor:', professorId);
            const pdfBuffer = await studentService.getValoracionesByProfessor(professorId);
            if (!pdfBuffer) {
                return res.status(404).json({ message: 'No se encontraron valoraciones para este profesor.' });
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=valoraciones_profesor_${professorId}.pdf`);
            res.setHeader('Content-Length', pdfBuffer.length.toString());
            return res.status(200).end(pdfBuffer);
        } catch (error) {
            console.error('Error al obtener valoraciones por profesor:', error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}
