import { CreateSubjectDTO } from "../../dtos/createSubjectDTO";
import { SubjectService } from "../../services/subject.service";


const subjectService = new SubjectService();

export class SubjectController {
    async createSubject(req: any, res: any): Promise<void> {
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
    
    async listSubjects(req: any, res: any): Promise<void> {
        try {
        const subjects = await subjectService.getAllSubjects();
        res.status(200).json(subjects);
        } catch (error) {
        console.error("Error al listar materias:", error);
        res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}