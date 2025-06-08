import { UserController } from "../controllers/user.controller";
import express from 'express';
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";
import { UserRole } from "../../entities/UserRole";

const routerUser = express.Router();
const userControllerInstance = new UserController();


routerUser.use(express.json());
routerUser.use(express.urlencoded({ extended: true }));

routerUser.post(
  '/',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  userControllerInstance.createUser
);
routerUser.get(
  '/profesores',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  userControllerInstance.listProfesores
);
routerUser.get(
  '/',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  userControllerInstance.listAllUsers
);
routerUser.get(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  userControllerInstance.getUserById
);
routerUser.put(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  userControllerInstance.updateUserById
);
routerUser.delete(
  '/:id',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  userControllerInstance.deleteUserById
);

export default routerUser;