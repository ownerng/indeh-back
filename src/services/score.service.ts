import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { CreateScoreDTO } from "../dtos/createScoreDTO";
import { PgScore } from "../entities/PgScore";

export class ScoreService {
    private scoreRepository = AppDataSource.getRepository(PgScore);

    async createScore(data: CreateScoreDTO): Promise<PgScore> {
        const newScore = this.scoreRepository.create(this.toPgScore(data));
        return await this.scoreRepository.save(newScore);
    }

    async updateCorte1(id: number, corte1: number): Promise<PgScore | null> {
        const score = await this.scoreRepository.findOneBy({ id });
        if (!score) {
            return null;
        }
        score.corte1 = corte1;
        return await this.scoreRepository.save(score);
    }

    async updateCorte2(id: number, corte2: number): Promise<PgScore | null> {
        const score = await this.scoreRepository.findOneBy({ id });
        if (!score) {
            return null;
        }
        score.corte2 = corte2;
        return await this.scoreRepository.save(score);
    }

    async updateCorte3(id: number, corte3: number): Promise<PgScore | null> {
        const score = await this.scoreRepository.findOneBy({ id });
        if (!score) {
            return null;
        }
        score.corte3 = corte3;
        if (score.corte1 !== null && score.corte2 !== null) score.notadefinitiva = ((score.corte1 * 0.3) + (score.corte2 * 0.3) + (score.corte3 * 0.4));
        
        return await this.scoreRepository.save(score);
    }

    async getScoresBySubjectId(subjectId: number[]): Promise<{ id: number; id_student: number }[]> {
        const scores = await this.scoreRepository.find({
            select: ["id", "id_student"],
            where: { id_subject: In(subjectId) },
            order: { id_student: "ASC" },
        });
        return scores.map(score => ({
            id: score.id,
            id_student: score.id_student,
        }));
    }
    private toPgScore(score: CreateScoreDTO): PgScore {
        const pgScore = new PgScore();
        pgScore.id_student = score.id_student;
        pgScore.id_subject = score.id_subject;
        pgScore.corte1 = null;
        pgScore.corte2 = null;
        pgScore.corte3 = null;
        pgScore.notadefinitiva = null;

        return pgScore;
    }
}