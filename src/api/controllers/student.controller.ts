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
        const { id } = req.params;
        try {
            const student = await studentService.getStudentsByGrade(id);
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
        const { obse } = req.body;
        const studentId = parseInt(id);

        if (isNaN(studentId)) {
            console.error("Error: ID de estudiante no válido.");
            return res.status(400).json({ message: 'ID de estudiante no válido.' });
        }

        try {
            const boletin = await studentService.getBoletinByStudentId(studentId, obse);


            if (!boletin) {
                console.warn(`Boletín no encontrado para el estudiante ID: ${studentId}`);
                return res.status(404).json({ message: 'Boletín no encontrado.' });
            }

            // Carga la plantilla HTML
            const templateFile = ['1','2','3','4','5','6', '7', '8', '9'].includes(boletin.grado)
                ? 'boletin6.html'
                : 'boletin.html';
            const templatePath = join(__dirname, '../../templates', templateFile);
            let htmlTemplate: string;
            try {
                htmlTemplate = readFileSync(templatePath, 'utf-8');
            } catch (readError) {
                console.error(`Error al leer la plantilla HTML en ${templatePath}:`, readError);
                return res.status(500).json({ message: 'Error al cargar la plantilla del boletín.' });
            }

            // Compila la plantilla con Handlebars
            const compiledTemplate = handlebars.compile(htmlTemplate);
            const content = compiledTemplate(boletin);

            let browser;
            try {
                browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });
                const page = await browser.newPage();

                await page.setContent(content, { waitUntil: 'networkidle0' });

                const pdfBuffer = await page.pdf({
                    format: 'Letter',
                    printBackground: true,
                    margin: {
                        top: '20px',
                        right: '20px',
                        bottom: '20px',
                        left: '20px',
                    },
                });
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename=boletin-${studentId}.pdf`); 
                res.setHeader('Content-Length', pdfBuffer.length.toString());

                return res.status(200).end(pdfBuffer);

            } catch (puppeteerError) {
                console.error("Error al generar el PDF con Puppeteer:", puppeteerError);
                return res.status(500).json({ message: 'Error al generar el PDF del boletín.' });
            } finally {
                if (browser) {
                    await browser.close();
                }
            }

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
        const { grado, obse } = req.body; // obse es un array de observaciones individuales

        try {
            const pdfBuffers = await studentService.getBoletinesByGradoWithRanking(grado, obse);

            // Crear el zip y enviarlo por stream
            const archive = archiver('zip');
            const zipStream = new stream.PassThrough();

            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename=boletines-grado-${grado}.zip`);

            archive.pipe(zipStream);
            zipStream.pipe(res);

            for (const pdf of pdfBuffers) {
                archive.append(pdf.buffer, { name: pdf.filename });
            }
            await archive.finalize();

            return res; // El zip se envía por stream
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error generando boletines.' });
        }
    }
}
