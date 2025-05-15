// src/index.ts
import 'dotenv/config';
import { createApp } from './infrastructure/http/server';
import { AppDataSource } from './infrastructure/database/DataSource';

import * as fs from 'fs';
import * as path from 'path';

const start = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');
        // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'db', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Ejecutar directamente el SQL crudo
    await AppDataSource.query(sql);
    console.log('✅ Script init.sql ejecutado');
    const app = createApp();
    const PORT = process.env.PORT || 3000;
    app.get('/', (req, res) => {
  res.send('Hello World!');
});

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Error during startup:', error);
  }
};

start();