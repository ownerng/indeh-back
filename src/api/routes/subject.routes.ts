import express from 'express';
import { SubjectController } from '../controllers/subject.controller';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware';
import { UserRole } from '../../entities/UserRole';

const routerSubject = express.Router();
const subjectControllerInstance = new SubjectController();


routerSubject.use(express.json());
routerSubject.use(express.urlencoded({ extended: true }));

routerSubject.post(
  '/',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  subjectControllerInstance.createSubject
);

routerSubject.get(
  '/',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  subjectControllerInstance.listSubjects
);

export default routerSubject;