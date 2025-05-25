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

export default routerStudent;