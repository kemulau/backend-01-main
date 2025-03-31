import { Router } from 'express';
import { 
cadastrarAluno,
listarAlunos, 
atualizarAluno } from '../controllers/AlunoController';
import { 
atualizarDisciplina,
cadastrarDisciplina } from '../controllers/DisciplinaController';
import { 
listarDisciplinasDoAluno,
vincularAlunoDisciplina } from '../controllers/AlunoDisciplinaController';


const router = Router();

router.put('/atualizarAluno/:alunoId', atualizarAluno);
router.get('/listarTodosAlunos', listarAlunos);
router.get('/listarTodasDisciplinasAluno', listarDisciplinasDoAluno);
router.post('/cadastrarDisciplina', cadastrarDisciplina);
router.post('/cadastrarAluno', cadastrarAluno);
router.post('/vincularAlunoDisciplina', vincularAlunoDisciplina);
router.put('/atualizarDisciplina/:discilinaId', atualizarDisciplina);

export default router;
