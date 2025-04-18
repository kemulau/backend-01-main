import { Router } from 'express';

import * as AlunoController from '../controllers/AlunoController';
import * as DisciplinaController from '../controllers/DisciplinaController';
import * as AlunoDisciplinaController from '../controllers/AlunoDisciplinaController';
import * as NotaController from '../controllers/NotaController';
import * as CursoController from '../controllers/CursoController';
import * as TurmaController from '../controllers/TurmaController';
import * as PresencaController from '../controllers/PresencaController';
import * as ProfessorController from '../controllers/ProfessorController';

const router = Router();

// ==================== Alunos ====================

router.post('/cadastrarAluno', AlunoController.cadastrarAluno);
router.get('/listarTodosAlunos', AlunoController.listarAlunos);
router.get('/alunos/:id', AlunoController.buscarAlunoPorId);
router.put('/atualizarAluno/:alunoId', AlunoController.atualizarAluno);
router.delete('/alunos/:id', AlunoController.deletarAluno);

router.get('/listarTodasDisciplinasAluno', AlunoDisciplinaController.listarDisciplinasDoAluno);
router.get('/alunos/:id/notas', AlunoController.listarNotasComMedia);
router.get('/alunos/:id/presencas', AlunoController.percentualPresenca);
router.get('/alunos/:id/situacao', AlunoController.situacaoAluno);


// ==================== Disciplinas ====================

router.post('/cadastrarDisciplina', DisciplinaController.cadastrarDisciplina);
router.get('/disciplinas/:id', DisciplinaController.buscarDisciplinaPorId);
router.put('/atualizarDisciplina/:id', DisciplinaController.atualizarDisciplina);
router.delete('/disciplinas/:id', DisciplinaController.deletarDisciplina);

router.post('/vincularAlunoDisciplina', AlunoDisciplinaController.vincularAlunoDisciplina);
router.get('/disciplinas/:id/reprovados', DisciplinaController.alunosReprovados);


// ==================== Cursos ====================

router.post('/cursos', CursoController.criarCurso);
router.get('/cursos', CursoController.listarCursos);
router.put('/cursos/:id', CursoController.atualizarCurso);
router.delete('/cursos/:id', CursoController.deletarCurso);


// ==================== Turmas ====================

router.post('/turmas', TurmaController.criarTurma);
router.get('/turmas', TurmaController.listarTurmas);
router.put('/turmas/:id', TurmaController.atualizarTurma);
router.delete('/turmas/:id', TurmaController.deletarTurma);


// ==================== Presenças ====================

router.post('/presencas', PresencaController.criarPresenca);
router.get('/presencas', PresencaController.listarPresencas);
router.put('/presencas/:id', PresencaController.atualizarPresenca);
router.delete('/presencas/:id', PresencaController.deletarPresenca);


// ==================== Notas ====================

router.post('/notas', NotaController.criarNota);
router.get('/notas', NotaController.listarNotas);
router.put('/notas/:id', NotaController.atualizarNota);
router.delete('/notas/:id', NotaController.deletarNota);


// ==================== Professores ====================

router.post('/professores', ProfessorController.criarProfessor);
router.get('/professores', ProfessorController.listarProfessores);
router.get('/professores/:id', ProfessorController.buscarProfessorPorId);
router.put('/professores/:id', ProfessorController.atualizarProfessor);
router.delete('/professores/:id', ProfessorController.deletarProfessor);

export default router;
