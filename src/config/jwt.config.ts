import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'SFC2bxP2KXSc1q73VbNr3MNuOUUAixOJZsLIeKL5qgE=';
export const JWT_EXPIRES = process.env.JWT_EXPIRES