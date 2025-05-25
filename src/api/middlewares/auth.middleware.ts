import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../entities/UserRole';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/jwt.config';

// Extendemos el tipo Request de Express para incluir la propiedad 'user'
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: UserRole;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string; role: UserRole };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

export const authorizeRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Acceso denegado. Rol no disponible.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado. Rol no autorizado.' });
    }
    next();
  };
};