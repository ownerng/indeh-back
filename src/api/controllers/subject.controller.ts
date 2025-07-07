import { Request, Response } from "express";
import { SubjectService } from "../../services/subject.service";
import { CreateSubjectDTO } from "../../dtos/createSubjectDTO";


const subjectService = new SubjectService();

export class SubjectController {
    async createSubject(req: Request, res: Response): Promise<void> {
        const data: CreateSubjectDTO = req.body;

        if (!data.nombre || !data.id_profesor) {
            res.status(400).json({ message: 'Nombre y ID del profesor son requeridos.' });
            return;
        }

        try {
            const newSubject = await subjectService.createSubject(data);
            res.status(201).json(newSubject);
        } catch (error) {
            console.error("Error al crear materia:", error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async createNuevoCiclo(req: Request, res: Response): Promise<void> {
        const {ciclo} = req.body;
        try {
            const newSubject = await subjectService.createSubjectsForNewCiclo(ciclo);
            res.status(201).json(newSubject);
        } catch (error) {
            console.error("Error al crear materia:", error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async listSubjects(req: Request, res: Response): Promise<void> {
        try {
            const subjects = await subjectService.getAllSubjects();
            res.status(200).json(subjects);
        } catch (error) {
            console.error("Error al listar materias:", error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async getSubjectById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const subjectId = parseInt(id);

        if (isNaN(subjectId)) {
            console.error("Error: ID de materia no válido.");
            return res.status(400).json({ message: 'ID de materia no válido.' });
        }

        try {
            const subject = await subjectService.getSubjectById(subjectId);
            return res.status(200).json(subject);
        } catch (error) {

            console.error("Error al obtener la materia:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async updateSubject(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const subjectId = parseInt(id);
        const data: CreateSubjectDTO = req.body;

        if (isNaN(subjectId)) {
            console.error("Error: ID de materia no válido.");
            return res.status(400).json({ message: 'ID de materia no válido.' });
        }

        try {
            const subject = await subjectService.updateSubjects(subjectId, data);
            return res.status(200).json(subject);
        } catch (error) {

            console.error("Error al obtener la materia:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async deleteSubjectById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const subjectId = parseInt(id);

        if (isNaN(subjectId)) {
            console.error("Error: ID de materia no válido.");
            return res.status(400).json({ message: 'ID de materia no válido.' });
        }

        try {
            const subject = await subjectService.deleteSubjectById(subjectId);
            return res.status(200).json(subject);
        } catch (error) {

            console.error("Error al obtener la materia:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}