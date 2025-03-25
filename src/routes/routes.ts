import { Router } from 'express';
import * as AlunoController from '../controllers/AlunoController';
import * as ApiController from '../controllers/apiController';

const router = Router();

router.post('', AlunoController.cadastrarAluno)
router.get('/kemulau', ApiController.ping)

router

export default router;
