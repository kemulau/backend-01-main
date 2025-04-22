import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';

describe('Testes do TurmaController', () => {
  let cursoId: number;
  let turmaId: number;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const curso = {
      nome: 'TADS',
      descricao: 'Curso de Tecnologia em Análise e Desenvolvimento de Sistemas'
    };
    const res = await request(server).post('/cursos').send(curso);
    cursoId = res.body.curso?.id;
  });

  it('deve criar uma nova turma vinculada a um curso', async () => {
    const novaTurma = {
      nome: 'Turma A - Noite',
      periodo: '2024/2',
      id_curso: cursoId,
    };

    const res = await request(server).post('/turmas').send(novaTurma);
    console.log("Criar turma:", res.status, res.body);
    expect(res.status).toBe(201);
    expect(res.body.turma).toBeDefined();
    turmaId = res.body.turma.id;
  });

  it('deve listar todas as turmas', async () => {
    const res = await request(server).get('/turmas');
    console.log("Listar turmas:", res.status, res.body);

    expect(res.status).toBe(200);

    const turmas = Array.isArray(res.body) ? res.body : res.body.turmas;
    expect(Array.isArray(turmas)).toBe(true);

    const turma = turmas.find((t: any) => t.id === turmaId);
    expect(turma).toBeDefined();
  });

  it('deve atualizar uma turma existente', async () => {
    const alteracao = { nome: 'Turma A - Atualizada' };
    const res = await request(server).put(`/turmas/${turmaId}`).send(alteracao);
    console.log("Atualizar turma:", res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body.turma.nome).toBe(alteracao.nome);
  });

  it('deve deletar uma turma', async () => {
    const res = await request(server).delete(`/turmas/${turmaId}`);
    console.log("Deletar turma:", res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body.message || res.body.mensagem).toMatch(/turma.*(deletada|excluída)/i);

    const resLista = await request(server).get('/turmas');
    const turmas = Array.isArray(resLista.body) ? resLista.body : resLista.body.turmas;
    const turmaRemovida = turmas?.find((t: any) => t.id === turmaId);
    expect(turmaRemovida).toBeUndefined();
  });
});
