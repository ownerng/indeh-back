import { Router } from "express";
import { PgUserRepository } from "../../database/repositories/PgUserRepository";
import { UserController } from "../controllers/userController";
import { LoginUseCase } from "../../../app/usecases/UserUseCases";

const router = Router();
const userRepository = new PgUserRepository();
const userController = new UserController(new LoginUseCase(userRepository));


router.post("/login", (req, res) => userController.login(req, res));


export const userRoutes = router;