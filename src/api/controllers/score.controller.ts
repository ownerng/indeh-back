import { CreateScoreDTO } from "../../dtos/createScoreDTO";
import { ScoreService } from "../../services/score.service";
import { Request, Response } from "express";

const scoreService = new ScoreService();

export class ScoreController {
    async createScore(req: Request, res: Response): Promise<void> {
        const scoreData: CreateScoreDTO = req.body;

        try {
            const newScore = await scoreService.createScore(scoreData);
            res.status(201).json(newScore);
        } catch (error) {
            console.error("Error al crear la nota:", error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
    async updateScore(req: Request, res: Response): Promise<Response> {
        const { id } = req.params
        const scoreId = parseInt(id);
        const scoreData: CreateScoreDTO = req.body;

        if (isNaN(scoreId)) {
            console.error("Error: ID de score no válido.");
            return res.status(400).json({ message: 'ID de score no válido.' });
        }

        try {
            const updateScore = await scoreService.updatescoreById(scoreId, scoreData);
            return res.status(201).json(updateScore);
        } catch (error) {
            console.error("Error al actualizar la nota:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async getAllScores(req: Request, res: Response): Promise<Response> {
        try {
            const scores = await scoreService.getAllScores();
            return res.status(200).json(scores);
        } catch (error) {
            console.error("Error al obtener la nota:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async getScoresById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params
        const scoreId = parseInt(id);

        if (isNaN(scoreId)) {
            console.error("Error: ID de score no válido.");
            return res.status(400).json({ message: 'ID de score no válido.' });
        }
        try {
            const scores = await scoreService.getScoreById(scoreId);
            return res.status(200).json(scores);
        } catch (error) {
            console.error("Error al obtener la nota:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async deleteScoresById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params
        const scoreId = parseInt(id);

        if (isNaN(scoreId)) {
            console.error("Error: ID de score no válido.");
            return res.status(400).json({ message: 'ID de score no válido.' });
        }
        try {
            const scores = await scoreService.deleteScoreById(scoreId);
            return res.status(200).json(scores);
        } catch (error) {
            console.error("Error al obtener la nota:", error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async updateCorte1(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { corte1 } = req.body;

        try {
            const updatedScore = await scoreService.updateCorte1(parseInt(id), corte1);
            if (updatedScore) {
                res.status(200).json(updatedScore);
            } else {
                res.status(404).json({ message: 'Nota no encontrada.' });
            }
        } catch (error) {
            console.error("Error al actualizar la nota:", error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async updateCorte2(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { corte2 } = req.body;

        try {
            const updatedScore = await scoreService.updateCorte2(parseInt(id), corte2);
            if (updatedScore) {
                res.status(200).json(updatedScore);
            } else {
                res.status(404).json({ message: 'Nota no encontrada.' });
            }
        } catch (error) {
            console.error("Error al actualizar la nota:", error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async updateCorte3(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { corte3 } = req.body;

        try {
            const updatedScore = await scoreService.updateCorte3(parseInt(id), corte3);
            if (updatedScore) {
                res.status(200).json(updatedScore);
            } else {
                res.status(404).json({ message: 'Nota no encontrada.' });
            }
        } catch (error) {
            console.error("Error al actualizar la nota:", error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}