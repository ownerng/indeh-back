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
    console.log('authorizeRole middleware called');
    console.log('User info:', req.user);
    console.log('Allowed roles:', allowedRoles);
    console.log('User role:', req.user?.role);
    
    if (!req.user || !req.user.role) {
      console.log('Access denied - no user or role');
      return res.status(403).json({ message: 'Acceso denegado. Rol no disponible.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      console.log('Access denied - role not allowed');
      return res.status(403).json({ message: 'Acceso denegado. Rol no autorizado.' });
    }
    console.log('Role authorization successful');
    next();
  };
};