import { UserController } from "../controllers/user.controller";
import express from 'express';
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";
import { UserRole } from "../../entities/UserRole";

const routerUser = express.Router();
const userControllerInstance = new UserController();

routerUser.post(
  '/',
  authenticateToken,
  authorizeRole([UserRole.EJECUTIVO]),
  userControllerInstance.createUser
);

export default routerUser;