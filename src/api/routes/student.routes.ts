import express from 'express';
import { StudentController } from '../controllers/student.controller';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware';
import { UserRole } from '../../entities/UserRole';

const routerStudent = express.Router();
const studentControllerInstance = new StudentController();

routerStudent.post(
  '/',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  express.json(), // Middleware para parsear JSON, solo para esta ruta
  express.urlencoded({ extended: true }),
  studentControllerInstance.createStudent
);

routerStudent.get(
  '/',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  express.json(), // Middleware para parsear JSON, solo para esta ruta
  express.urlencoded({ extended: true }),
  studentControllerInstance.getAllStudents
)

routerStudent.get(
  '/profesor',
  authenticateToken,
  authorizeRole([UserRole.PROFESOR]),
  express.json(), // Middleware para parsear JSON, solo para esta ruta
  express.urlencoded({ extended: true }),
  studentControllerInstance.getStudentsByProfessorId
)

routerStudent.post(
  '/boletin/:id',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  express.json(), // Middleware para parsear JSON, solo para esta ruta
  express.urlencoded({ extended: true }),
  studentControllerInstance.getBoletinByStudentId
)

routerStudent.get(
  '/excel',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  express.json(), // Middleware para parsear JSON, solo para esta ruta
  express.urlencoded({ extended: true }),
  studentControllerInstance.exportAllStudentsToExcel
)

routerStudent.post(
  '/boletin',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  express.json(), // Middleware para parsear JSON, solo para esta ruta
  express.urlencoded({ extended: true }),
  studentControllerInstance.getBoletinesByGrado
)

routerStudent.get(
  '/update/scores/all',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  express.json(), // Middleware para parsear JSON, solo para esta ruta
  express.urlencoded({ extended: true }),
  studentControllerInstance.updateScoresForStudents
)

routerStudent.put(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  express.json(), // Middleware para parsear JSON, solo para esta ruta
  express.urlencoded({ extended: true }),
  studentControllerInstance.updateStudent
)

routerStudent.put(
  '/promover/:id',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  express.json(), // Middleware para parsear JSON, solo para esta ruta
  express.urlencoded({ extended: true }),
  studentControllerInstance.promoverEstudiante
)

routerStudent.delete(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  express.json(), // Middleware para parsear JSON, solo para esta ruta
  express.urlencoded({ extended: true }),
  studentControllerInstance.deleteStudentById
)

routerStudent.get(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  express.json(), // Middleware para parsear JSON, solo para esta ruta
  express.urlencoded({ extended: true }),
  studentControllerInstance.getStudentById
)
routerStudent.post(
  '/grado/jornada',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  express.json(), // Middleware para parsear JSON, solo para esta ruta
  express.urlencoded({ extended: true }),
  studentControllerInstance.getStudentByGrade
)

export default routerStudent;