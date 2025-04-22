import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';

describe('Testes do PresencaController', () => {
  let alunoId: number;
  let disciplinaId: number;
  let presencaId: number;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve registrar uma presença para um aluno em uma disciplina', async () => {
    const alunoRes = await request(server).post('/cadastrarAluno').send({
      nome: 'Marcos Silva',
      email: 'marcos.silva@email.com',
      matricula: 'T1234567',
    });
    expect(alunoRes.status).toBe(201);
    expect(alunoRes.body.novoAluno).toBeDefined();
    alunoId = alunoRes.body.novoAluno.id;

    const disciplinaRes = await request(server).post('/cadastrarDisciplina').send({
      nome: 'Engenharia de Software',
    });
    expect(disciplinaRes.status).toBe(201);
    expect(disciplinaRes.body.novaDisciplina).toBeDefined();
    disciplinaId = disciplinaRes.body.novaDisciplina.id;

    const presencaRes = await request(server).post('/presencas').send({
      alunoId,
      disciplinaId,
      presente: true,
      data: new Date(),
    });
    expect(presencaRes.status).toBe(201);
    expect(presencaRes.body.presenca).toBeDefined();
    presencaId = presencaRes.body.presenca.id;
  });

  it('deve listar todas as presenças registradas', async () => {
    const res = await request(server).get('/presencas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const encontrada = res.body.find((p: any) => p.id === presencaId);
    expect(encontrada).toBeDefined();
    expect(encontrada.alunoId).toBe(alunoId);
    expect(encontrada.disciplinaId).toBe(disciplinaId);
  });

  it('deve atualizar uma presença existente', async () => {
    const res = await request(server).put(`/presencas/${presencaId}`).send({
      presente: false,
    });
    expect(res.status).toBe(200);
    expect(res.body.presenca).toBeDefined();
    expect(res.body.presenca.presente).toBe(false);
  });

  it('deve deletar uma presença', async () => {
    const res = await request(server).delete(`/presencas/${presencaId}`);
    expect(res.status).toBe(200);
    expect(res.body.message || res.body.mensagem).toBe("Presença deletada com sucesso.");

    const confirm = await request(server).get('/presencas');
    const apagada = confirm.body.find((p: any) => p.id === presencaId);
    expect(apagada).toBeUndefined();
  });
});
