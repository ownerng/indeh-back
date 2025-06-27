import express from 'express';
import { ScoreController } from '../controllers/score.controller';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware';
import { UserRole } from '../../entities/UserRole';

const routerScores = express.Router();
const scoreControllerInstance = new ScoreController();

routerScores.use(express.json());
routerScores.use(express.urlencoded({ extended: true }));

routerScores.post('/', authenticateToken, authorizeRole([UserRole.EJECUTIVO]), scoreControllerInstance.createScore);
routerScores.put('/corte1/:id', authenticateToken, authorizeRole([UserRole.PROFESOR]), scoreControllerInstance.updateCorte1);
routerScores.put('/corte2/:id', authenticateToken, authorizeRole([UserRole.PROFESOR]), scoreControllerInstance.updateCorte2);
routerScores.put('/corte3/:id', authenticateToken, authorizeRole([UserRole.PROFESOR]), scoreControllerInstance.updateCorte3);
routerScores.get('/', authenticateToken, authorizeRole([UserRole.EJECUTIVO]), scoreControllerInstance.getAllScores);
routerScores.get('/:id', authenticateToken, authorizeRole([UserRole.EJECUTIVO]), scoreControllerInstance.getScoresById);
routerScores.put('/:id', authenticateToken, authorizeRole([UserRole.EJECUTIVO]), scoreControllerInstance.updateScore);
routerScores.delete('/:id', authenticateToken, authorizeRole([UserRole.EJECUTIVO]), scoreControllerInstance.deleteScoresById);
routerScores.get('/student/:id', authenticateToken, authorizeRole([UserRole.PROFESOR]), scoreControllerInstance.getScoresByStudentId);
export default routerScores;