import { Router } from "express";
import { PgStudentRepository } from "../../database/repositories/PgStudentRepository";
import { StudentController } from "../controllers/studentController";
import { CreateStudentUseCase, GetAllStudentsUseCase, GetStudentByIdUseCase, UpdateStudentUseCase } from "../../../app/usecases/StudentUseCases";
import { GetCalificationsByStudentIdUseCase, UpdateAllCalificationsByStudentIdUseCase, UpdateCalificationUseCase } from "../../../app/usecases/CalificationUseCases";
import { PgCalificationRepository } from "../../database/repositories/PgCalificationRepository";
import { GetAllSubjectsUseCase } from "../../../app/usecases/SubjectUseCases";
import { PgSubjectRepository } from "../../database/repositories/PgSubjectRepository";

const router = Router();

const studentRepository = new PgStudentRepository();
const calificationRepository = new PgCalificationRepository();
const subjectRepository = new PgSubjectRepository();
const studentController = new StudentController(
    new CreateStudentUseCase(studentRepository),
    new GetStudentByIdUseCase(studentRepository),
    new UpdateStudentUseCase(studentRepository),
    new GetAllStudentsUseCase(studentRepository),
    new GetCalificationsByStudentIdUseCase(calificationRepository),
    new GetAllSubjectsUseCase(subjectRepository),
    new UpdateCalificationUseCase(calificationRepository),
    new UpdateAllCalificationsByStudentIdUseCase(calificationRepository),
);

router.post("/", (req, res) => studentController.createStudent(req, res));
router.get("/", (req, res) => studentController.getAllStudents(req, res));
router.get("/:id", (req, res) => studentController.getStudentById(req, res));
router.put("/", (req, res) => studentController.updateStudent(req, res));
router.get("/:id/califications", (req, res) => studentController.getCalificationsByStudentId(req, res));
router.put("/:id/califications/all", (req, res) => studentController.updateStudentAllCalificationById(req, res));
router.get("/:id/certificate", (req, res) => studentController.generateCertificatePdf(req, res));

export const studentRoutes = router;