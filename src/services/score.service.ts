import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { CreateScoreDTO } from "../dtos/createScoreDTO";
import { PgScore } from "../entities/PgScore";
import { PgStudent } from "../entities/PgStudent";
import { PgSubject } from "../entities/PgSubject";

export class ScoreService {
    private scoreRepository = AppDataSource.getRepository(PgScore);

    async createScore(data: CreateScoreDTO): Promise<PgScore> {
        const newScore = this.scoreRepository.create(this.toPgScore(data));
        return await this.scoreRepository.save(newScore);
    }

    async getAllScores(): Promise<PgScore[] | null> {
        return await this.scoreRepository.find();

    }
    async getScoreById(id: number): Promise<PgScore | null> {
        const score = await this.scoreRepository.findOneBy({id: id});
        if(!score){
            return null;
        }
        return score;
        
    }
    async deleteScoreById(id: number): Promise<PgScore | null> {
        const score = await this.scoreRepository.findOneBy({id: id});
        if(!score){
            return null;
        }
        return await this.scoreRepository.remove(score);
        
        
    }
    async updatescoreById(id: number, data: CreateScoreDTO): Promise<PgScore | null> {
        const score = await this.scoreRepository.findOneBy({id: id});
        if(!score){
            return null;
        }
        score.id_student = {id : data.id_student} as PgStudent;
        score.id_subject = {id: data.id_subject} as PgSubject;
        return await this.scoreRepository.save(score);
    }

    async getScoresByStudentId(studentId: number): Promise<PgScore[]> {
        const scores = await this.scoreRepository.find({ where: { id_student: {id: studentId} }, relations:{
            id_student: true,
            id_subject: true,
        } });
        return scores;
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

    async getScoresBySubjectId(subjectId: number[]): Promise<{ id: number; id_student: number; id_subject: number }[]> {
        const scores = await this.scoreRepository.find({
            select: ["id", "id_student", "id_subject"],
            where: { id_subject: {id: In(subjectId)} },
            order: { id_student: {id: "ASC" }},
            relations: {
                id_student: true,
                id_subject : true
            }
        });
        return scores.map(score => ({
            id: score.id,
            id_student: score.id_student.id,
            id_subject: score.id_subject.id
        }));
    }
    private toPgScore(score: CreateScoreDTO): PgScore {
        const pgScore = new PgScore();
        pgScore.id_student = {id: score.id_student} as PgStudent;
        pgScore.id_subject = {id: score.id_subject} as PgSubject;
        pgScore.corte1 = null;
        pgScore.corte2 = null;
        pgScore.corte3 = null;
        pgScore.notadefinitiva = null;

        return pgScore;
    }
}