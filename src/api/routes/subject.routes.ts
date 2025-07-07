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

routerSubject.post(
  '/nuevo/ciclo',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  subjectControllerInstance.createNuevoCiclo
);

routerSubject.get(
  '/ciclos',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO, UserRole.PROFESOR]),
  subjectControllerInstance.listCiclos
);

routerSubject.get(
  '/',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  subjectControllerInstance.listSubjects
);

routerSubject.get(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  subjectControllerInstance.getSubjectById
);

routerSubject.put(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  subjectControllerInstance.updateSubject
);

routerSubject.delete(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  subjectControllerInstance.deleteSubjectById
)

export default routerSubject;