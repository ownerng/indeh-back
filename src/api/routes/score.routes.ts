import express from 'express';
import { ScoreController } from '../controllers/score.controller';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware';
import { UserRole } from '../../entities/UserRole';

const routerScores = express.Router();
const scoreControllerInstance = new ScoreController();


routerScores.post('/', authenticateToken, authorizeRole([UserRole.EJECUTIVO]), scoreControllerInstance.createScore);
routerScores.put('/corte1/:id', authenticateToken, authorizeRole([UserRole.PROFESOR]), scoreControllerInstance.updateCorte1);
routerScores.put('/corte2/:id', authenticateToken, authorizeRole([UserRole.PROFESOR]), scoreControllerInstance.updateCorte2);
routerScores.put('/corte3/:id', authenticateToken, authorizeRole([UserRole.PROFESOR]), scoreControllerInstance.updateCorte3);

export default routerScores;