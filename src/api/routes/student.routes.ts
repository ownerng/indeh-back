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

routerStudent.get(
  '/boletin/:id',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  studentControllerInstance.getBoletinByStudentId
)

export default routerStudent;