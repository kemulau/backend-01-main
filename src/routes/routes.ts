import { Router } from 'express';
import { login } from '../controllers/apiController';
import { authMiddleware, autorizaTipos } from '../middleware/auth';

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

router.post('/cadastrarAluno', AlunoController.cadastrarAluno); // sem middleware
router.get('/listarTodosAlunos', authMiddleware, autorizaTipos('professor'), AlunoController.listarAlunos);
router.get('/alunos/:id', authMiddleware, autorizaTipos('professor'), AlunoController.buscarAlunoPorId);
router.put('/atualizarAluno/:alunoId', authMiddleware, autorizaTipos('professor'), AlunoController.atualizarAluno);
router.delete('/alunos/:id', authMiddleware, autorizaTipos('professor'), AlunoController.deletarAluno);

router.get('/listarTodasDisciplinasAluno', authMiddleware, AlunoDisciplinaController.listarDisciplinasDoAluno);
router.get('/alunos/:id/notas', authMiddleware, autorizaTipos('professor'), AlunoController.listarNotasComMedia);
router.get('/alunos/:id/presencas', authMiddleware, autorizaTipos('professor'), AlunoController.percentualPresenca);
router.get('/alunos/:id/situacao', authMiddleware, autorizaTipos('professor'), AlunoController.situacaoAluno);

// ==================== Disciplinas ====================

router.post('/cadastrarDisciplina', authMiddleware, autorizaTipos('professor'), DisciplinaController.cadastrarDisciplina);
router.get('/disciplinas/:id', authMiddleware, DisciplinaController.buscarDisciplinaPorId);
router.put('/atualizarDisciplina/:id', authMiddleware, autorizaTipos('professor'), DisciplinaController.atualizarDisciplina);
router.delete('/disciplinas/:id', authMiddleware, autorizaTipos('professor'), DisciplinaController.deletarDisciplina);

router.post('/vincularAlunoDisciplina', authMiddleware, autorizaTipos('professor'), AlunoDisciplinaController.vincularAlunoDisciplina);
router.get('/disciplinas/:id/reprovados', authMiddleware, autorizaTipos('professor'), DisciplinaController.alunosReprovados);

// ==================== Cursos ====================

router.post('/cursos', authMiddleware, autorizaTipos('professor'), CursoController.criarCurso);
router.get('/cursos', authMiddleware, CursoController.listarCursos);
router.put('/cursos/:id', authMiddleware, autorizaTipos('professor'), CursoController.atualizarCurso);
router.delete('/cursos/:id', authMiddleware, autorizaTipos('professor'), CursoController.deletarCurso);

// ==================== Turmas ====================

router.post('/turmas', authMiddleware, autorizaTipos('professor'), TurmaController.criarTurma);
router.get('/turmas', authMiddleware, TurmaController.listarTurmas);
router.put('/turmas/:id', authMiddleware, autorizaTipos('professor'), TurmaController.atualizarTurma);
router.delete('/turmas/:id', authMiddleware, autorizaTipos('professor'), TurmaController.deletarTurma);

// ==================== Presenças ====================

router.post('/presencas', authMiddleware, autorizaTipos('professor'), PresencaController.criarPresenca);
router.get('/presencas', authMiddleware, PresencaController.listarPresencas);
router.put('/presencas/:id', authMiddleware, autorizaTipos('professor'), PresencaController.atualizarPresenca);
router.delete('/presencas/:id', authMiddleware, autorizaTipos('professor'), PresencaController.deletarPresenca);

// ==================== Notas ====================

router.post('/notas', authMiddleware, autorizaTipos('professor'), NotaController.criarNota);
router.get('/notas', authMiddleware, NotaController.listarNotas);
router.put('/notas/:id', authMiddleware, autorizaTipos('professor'), NotaController.atualizarNota);
router.delete('/notas/:id', authMiddleware, autorizaTipos('professor'), NotaController.deletarNota);

// ==================== Professores ====================

router.post('/professores', authMiddleware, autorizaTipos('professor'), ProfessorController.criarProfessor);
router.get('/professores', authMiddleware, ProfessorController.listarProfessores);
router.get('/professores/:id', authMiddleware, ProfessorController.buscarProfessorPorId);
router.put('/professores/:id', authMiddleware, autorizaTipos('professor'), ProfessorController.atualizarProfessor);
router.delete('/professores/:id', authMiddleware, autorizaTipos('professor'), ProfessorController.deletarProfessor);

// ==================== ATV FINAL ====================

// Login público
router.post('/login', login);

// Dashboard – qualquer usuário autenticado
router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ mensagem: `Bem-vindo, ${req.user.nome}!`, tipo: req.user.tipo });
});

export default router;
