import { Request, Response } from "express";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { LoginUseCase } from "../../../app/usecases/UserUseCases";

export class UserController {
    constructor( private loginUseCase: LoginUseCase) {}

    async login(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;

        try {
            const user = await this.loginUseCase.execute(username, password);
            if (user) {
                res.status(200).json({ message: "Login successful", user });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }
}