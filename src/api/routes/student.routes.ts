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
  studentControllerInstance.createStudent
);

routerStudent.get(
  '/',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  studentControllerInstance.getAllStudents
)

routerStudent.get(
  '/profesor',
  authenticateToken,
  authorizeRole([UserRole.PROFESOR]),
  studentControllerInstance.getStudentsByProfessorId
)

export default routerStudent;