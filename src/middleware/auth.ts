import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const secret = process.env.JWT_SECRET || 'segredo123';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ erro: 'Token ausente' });

  try {
    const payload = jwt.verify(token, secret) as any;
    req.user = payload;
    next();
  } catch {
    res.status(403).json({ erro: 'Token inválido ou expirado' });
  }
}

export function autorizaTipos(...tiposPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !tiposPermitidos.includes(req.user.tipo)) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }
    next();
  };
}
