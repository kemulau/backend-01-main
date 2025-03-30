import { cadastrarAluno, listarAlunos } from '../controllers/AlunoController';
import { cadastrarDisciplina } from '../controllers/DisciplinaController';
import { listarDisciplinasDoAluno, vincularAlunoDisciplina } from '../controllers/AlunoDisciplinaController';
import { Router } from 'express';

const router = Router();

router.get('/listarTodosAlunos', listarAlunos);
router.get('/listarTodasDisciplinasAluno', listarDisciplinasDoAluno);
router.post('/cadastrarDisciplina', cadastrarDisciplina);
router.post('/cadastrarAluno', cadastrarAluno);
router.post('/vincularAlunoDisciplina', vincularAlunoDisciplina);

export default router;
