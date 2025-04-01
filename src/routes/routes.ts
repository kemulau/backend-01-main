import { Router } from 'express';
import { 
cadastrarAluno,
listarAlunos, 
atualizarAluno,
deletarAluno,
buscarAlunoPorId } from '../controllers/AlunoController';
import { 
atualizarDisciplina,
cadastrarDisciplina,
deletarDisciplina,
buscarDisciplinaPorId } from '../controllers/DisciplinaController';
import { 
listarDisciplinasDoAluno,
vincularAlunoDisciplina } from '../controllers/AlunoDisciplinaController';


const router = Router();

router.delete('/alunos/:id', deletarAluno);
router.get('/alunos/:id', buscarAlunoPorId);
router.put('/atualizarAluno/:alunoId', atualizarAluno);
router.get('/listarTodosAlunos', listarAlunos);
router.post('/cadastrarAluno', cadastrarAluno);
router.get('/listarTodasDisciplinasAluno', listarDisciplinasDoAluno);

router.delete('/disciplinas/:id', deletarDisciplina);
router.get('/disciplinas/:id', buscarDisciplinaPorId);
router.post('/cadastrarDisciplina', cadastrarDisciplina);
router.post('/vincularAlunoDisciplina', vincularAlunoDisciplina);
router.put('/atualizarDisciplina/:id', atualizarDisciplina);

export default router;
