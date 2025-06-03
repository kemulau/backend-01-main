import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        nome: string;
        tipo: string;
        [key: string]: any;
      };
    }
  }
}

const secret = process.env.JWT_SECRET || 'segredo123';

// Middleware de autenticação JWT
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ erro: 'Token ausente' });
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;

    if (!payload.id || !payload.nome || !payload.tipo) {
      return res.status(403).json({ erro: 'Token inválido: dados incompletos' });
    }

    req.user = {
      id: payload.id,
      nome: payload.nome,
      tipo: payload.tipo,
      ...payload // caso queira manter outros dados
    };

    next();
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado' });
  }
}

// Middleware de autorização por tipo de usuário
export function autorizaTipos(...tiposPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !tiposPermitidos.includes(req.user.tipo)) {
      return res.status(403).json({ erro: 'Acesso negado: tipo não autorizado' });
    }
    next();
  };
}
