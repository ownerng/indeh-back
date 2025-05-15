import { Request, Response } from "express";
import { CreateStudentUseCase, GetAllStudentsUseCase, GetStudentByIdUseCase, UpdateStudentUseCase } from "../../../app/usecases/StudentUseCases";
import { CreateStudentDTO } from "../../../app/dtos/CreateStudentDTO";
import { Student } from "../../../domain/entities/student";
import { GetCalificationsByStudentIdUseCase, UpdateAllCalificationsByStudentIdUseCase, UpdateCalificationUseCase } from "../../../app/usecases/CalificationUseCases";
import { GetAllSubjectsUseCase } from "../../../app/usecases/SubjectUseCases";

import PdfPrinter from 'pdfmake';
import fs from 'fs';
import path from 'path';

const fonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};

const printer = new PdfPrinter(fonts);

export class StudentController {
    constructor(
        private createStudentUseCase: CreateStudentUseCase,
        private getStudentByIdUseCase: GetStudentByIdUseCase,
        private updateStudentUseCase: UpdateStudentUseCase,
        private getAllStudentsUseCase: GetAllStudentsUseCase,
        private getCalificationsByStudentIdUseCase:  GetCalificationsByStudentIdUseCase,
        private getAllSubjects: GetAllSubjectsUseCase,
        private updateCalificationUseCase: UpdateCalificationUseCase,
        private updateAllCalificationsByStudentIdUseCase: UpdateAllCalificationsByStudentIdUseCase
    ){}

    async createStudent(req: Request, res: Response) {
        try {
            const studentData: CreateStudentDTO = req.body;
            const student = await this.createStudentUseCase.execute(studentData);
            console.log(student);
            res.status(201).json({
                "message": "Student created successfully",
                "data": student});
        } catch (error: any) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async getAllStudents(req: Request, res: Response) {
        try {
            const students = await this.getAllStudentsUseCase.execute();
            if (!students || students.length === 0) {
                return res.status(404).json({ message: "No students found" });
            }
            res.status(200).json({
                "message": "Students retrieved successfully",
                "data": students});
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getStudentById(req: Request, res: Response) {
        try {
            const studentId = req.params.id;
            const student = await this.getStudentByIdUseCase.execute(studentId);
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json({
                "message": "Student retrieved successfully",
                "data": student});
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateStudent(req: Request, res: Response) {
        try {
            const studentData: Student = req.body;
            const updatedStudent = await this.updateStudentUseCase.execute(studentData);
            if (!updatedStudent) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json({
                "message": "Student updated successfully",
                "data": updatedStudent});
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCalificationsByStudentId(req: Request, res: Response) {
        try {
            const studentId = req.params.id;
            const califications = await this.getCalificationsByStudentIdUseCase.execute(studentId);
            if (!califications || califications.length === 0) {
                return res.status(404).json({ message: "No califications found for this student" });
            }
            const subjects = await this.getAllSubjects.execute();
            const student = await this.getStudentByIdUseCase.execute(studentId);
            const calificationsWithSubjectName = califications.map(calification => {
                const subject = subjects.find(subject => subject.id === calification.id_subject);
                return {
                    ...calification,
                    subject_name: subject ? subject.nombre : null
                };
            });
            res.status(200).json({
                "student": student,
                "califications": calificationsWithSubjectName});
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }

        
    }

    async updateStudentCalificationById(req: Request, res: Response) {
        try {
            const calificationId = req.params.id;
            const calificationData = req.body;
            const updatedCalification = await this.updateCalificationUseCase.execute(parseInt(calificationId, 10), calificationData);
            if (!updatedCalification) {
                return res.status(404).json({ message: "Calification not found" });
            }
            res.status(200).json({
                "message": "Calification updated successfully",
                "data": updatedCalification});
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateStudentAllCalificationById(req: Request, res: Response) {
        try {
            const studentId = req.params.id;
            const calificationData = req.body;
            console.log(calificationData);
            const updatedCalification = await this.updateAllCalificationsByStudentIdUseCase.execute(studentId, calificationData);
            console.log(updatedCalification);
            if (!updatedCalification) {
                return res.status(404).json({ message: "Calification not found" });
            }
            res.status(200).json({
                "message": "Calification updated successfully",
                "data": updatedCalification});
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

   async generateCertificatePdf(req: Request, res: Response) {
    try {
        const studentId = req.params.id;

        // 1. Fetch Data
        const student = await this.getStudentByIdUseCase.execute(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const califications = await this.getCalificationsByStudentIdUseCase.execute(studentId);
        const subjects = await this.getAllSubjects.execute();

        const calificationsWithSubjectName = califications.map(calification => {
            const subject = subjects.find(subject => subject.id === calification.id_subject);
            return {
                ...calification,
                subject_name: subject ? subject.nombre : 'Asignatura Desconocida'
            };
        });

        // 2. Define PDF Document Structure
        const documentDefinition: any = {
            pageSize: 'A4',
            pageOrientation: 'portrait',
            pageMargins: [40, 60, 40, 60],
            content: [
                { text: 'CERTIFICADO DE CALIFICACIONES', style: 'header', alignment: 'center', margin: [0, 0, 0, 20] },
                { text: `Estudiante: ${student.nombres_apellidos}`, style: 'subheader' },
                { text: `Grado: ${student.grado}`, style: 'subheader', margin: [0, 0, 0, 20] },

                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto'],
                        body: [
                            [{ text: 'Asignatura', style: 'tableHeader' }, { text: 'Calificación', style: 'tableHeader', alignment: 'center' }],
                            ...calificationsWithSubjectName.map(cal => [
                                { text: cal.subject_name, style: 'tableCell' },
                                { text: cal.calificacion !== null ? cal.calificacion.toString() : 'N/A', style: 'tableCell', alignment: 'center' }
                            ])
                        ]
                    },
                    layout: {
                        hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? 2 : 1,
                        vLineWidth: (i: number, node: any) => (i === 0 || i === node.table.widths.length) ? 2 : 1,
                        hLineColor: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? '#000' : '#aaa',
                        vLineColor: (i: number, node: any) => (i === 0 || i === node.table.widths.length) ? '#000' : '#aaa'
                    }
                },

                { text: `Fecha de Emisión: ${new Date().toLocaleDateString()}`, alignment: 'right', margin: [0, 20, 0, 0], style: 'footer' }
            ],
            styles: {
                header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
                tableHeader: { bold: true, fontSize: 12, color: 'black', fillColor: '#eeeeee' },
                tableCell: { margin: [0, 5, 0, 5] },
                footer: { fontSize: 10, italics: true }
            },
            defaultStyle: {
                font: 'Helvetica'
            }
        };

        // 3. Generate PDF and stream to response
        const pdfDoc = printer.createPdfKitDocument(documentDefinition);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=certificado-${student.nombres_apellidos}.pdf`);
        pdfDoc.pipe(res);
        pdfDoc.end();

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
}

}