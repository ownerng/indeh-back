import { CreateScoreDTO } from "../../dtos/createScoreDTO";
import { ScoreService } from "../../services/score.service";

const scoreService = new ScoreService();

export class ScoreController {
    async createScore(req: any, res: any): Promise<void> {
        const scoreData: CreateScoreDTO = req.body;

        try {
            const newScore = await scoreService.createScore(scoreData);
            res.status(201).json(newScore);
        } catch (error) {
            console.error("Error al crear la nota:", error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async updateCorte1(req: any, res: any): Promise<void> {
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

    async updateCorte2(req: any, res: any): Promise<void> {
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

    async updateCorte3(req: any, res: any): Promise<void> {
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