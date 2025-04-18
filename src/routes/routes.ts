import { Router } from 'express';
import { 
cadastrarAluno,
listarAlunos, 
atualizarAluno,
deletarAluno,
buscarAlunoPorId,
percentualPresenca,
listarNotasComMedia,
situacaoAluno, } from '../controllers/AlunoController';
import { 
atualizarDisciplina,
cadastrarDisciplina,
deletarDisciplina,
buscarDisciplinaPorId,
alunosReprovados
} from '../controllers/DisciplinaController';
import { 
listarDisciplinasDoAluno,
vincularAlunoDisciplina } from '../controllers/AlunoDisciplinaController';
import * as NotaController from '../controllers/NotaController'
import * as CursoController from '../controllers/CursoController'
import * as TurmaController from '../controllers/TurmaController'
import * as PresencaController from '../controllers/PresencaController'
import * as ProfessorController from '../controllers/ProfessorController'

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

router.get('/alunos/:id/notas', listarNotasComMedia);
router.get('/alunos/:id/presencas', percentualPresenca);
router.get('/alunos/:id/situacao', situacaoAluno);

router.get('/disciplinas/:id/reprovados', alunosReprovados);

router.post('/cursos', CursoController.criarCurso);       // Create
router.get('/cursos', CursoController.listarCursos);      // Read (todos)
router.put('/cursos/:id', CursoController.atualizarCurso);// Update
router.delete('/cursos/:id', CursoController.deletarCurso);// Delete

router.post('/turmas', TurmaController.criarTurma);
router.get('/turmas', TurmaController.listarTurmas);
router.put('/turmas/:id', TurmaController.atualizarTurma);
router.delete('/turmas/:id', TurmaController.deletarTurma);

router.post('/presencas', PresencaController.criarPresenca);
router.get('/presencas', PresencaController.listarPresencas);
router.put('/presencas/:id', PresencaController.atualizarPresenca);
router.delete('/presencas/:id', PresencaController.deletarPresenca);

router.post('/notas', NotaController.criarNota);
router.get('/notas', NotaController.listarNotas);
router.put('/notas/:id', NotaController.atualizarNota);
router.delete('/notas/:id', NotaController.deletarNota);

router.post('/professores', ProfessorController.criarProfessor);
router.get('/professores', ProfessorController.listarProfessores);
router.get("/professores/:id", ProfessorController.buscarProfessorPorId);
router.put('/professores/:id', ProfessorController.atualizarProfessor);
router.delete('/professores/:id', ProfessorController.deletarProfessor);





export default router;
