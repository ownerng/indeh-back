import express, { Application, Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routerAuth from './api/routes/auth.routes';
import routerUser from './api/routes/user.routes';
import { UserService } from './services/user.service';
import { AppDataSource } from './config/data-source';
import routerStudent from './api/routes/student.routes';
import routerSubject from './api/routes/subject.routes';
import routerScores from './api/routes/score.routes';

dotenv.config();

const app: Application = express();
const port = process.env.SERVER_PORT || 3000;
const corsOptions = {
  origin: 'http://localhost:5173', // <--- Especifica el origen de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // <--- Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // <--- Encabezados permitidos (importante para tokens)
  credentials: true // Si necesitas manejar cookies o sesiones (no aplica directamente para JWT en este caso, pero es buena práctica)
};
// Middlewares
app.use(express.json()); // Para parsear application/json
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded

// Rutas
app.get('/', (req: ExpressRequest, res: ExpressResponse) => {
  res.send('API de Gestión Académica funcionando!');
});

app.use('/api/auth', routerAuth);
app.use('/api/users', routerUser);
app.use('/api/students', routerStudent); 
app.use('/api/subjects', routerSubject); 
app.use('/api/scores', routerScores); 

app.use((err: Error, req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});


export const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Fuente de datos inicializada correctamente.");

    const appUserService = new UserService(); // Usar el alias si es necesario
    await appUserService.createInitialAdminUser();

    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error durante la inicialización de la fuente de datos:", error);
    process.exit(1); // Salir si la base de datos no se puede conectar
  }
};
