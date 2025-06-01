import express from 'express';
import { AuthController } from '../controllers/auth.controller';

const routerAuth = express.Router();
const authControllerInstance = new AuthController();


routerAuth.use(express.json());
routerAuth.use(express.urlencoded({ extended: true }));

routerAuth.post('/login', authControllerInstance.login);

export default routerAuth;