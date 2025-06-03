import { Router } from 'express';
import { authMiddleware, autorizaTipos } from '../middleware/auth';

const router = Router();

router.get('/protegida', authMiddleware, (req, res) => {
  res.status(200).json({ mensagem: 'Acesso permitido com token válido!' });
});

router.get('/protegida/professor', authMiddleware, autorizaTipos('professor'), (req, res) => {
  res.status(200).json({ mensagem: 'Bem-vindo, professor autorizado!' });
});

export default router;
