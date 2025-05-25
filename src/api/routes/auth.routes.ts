import express from 'express';
import { AuthController } from '../controllers/auth.controller';

const routerAuth = express.Router();
const authControllerInstance = new AuthController();

routerAuth.post('/login', authControllerInstance.login);

export default routerAuth;