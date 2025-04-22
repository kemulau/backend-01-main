import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';

describe('Testes do NotaController', () => {
  let notaId: number;
  let alunoId: number;
  let disciplinaId: number;

  // Garante que as tabelas estão sincronizadas antes dos testes
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Fecha a conexão com o banco após todos os testes
  afterAll(async () => {
    await sequelize.close();
  });

  it('deve criar uma nota para um aluno em uma disciplina', async () => {
    const alunoData = {
      nome: 'Alice Morais',
      email: 'alice.morais@gmail.com',
      matricula: '20234567',
    };

    const alunoRes = await request(server).post('/cadastrarAluno').send(alunoData);
    expect(alunoRes.status).toBe(201);
    expect(alunoRes.body.novoAluno).toBeDefined();
    alunoId = alunoRes.body.novoAluno.id;

    const disciplinaData = { nome: 'Banco de Dados II' };
    const disciplinaRes = await request(server).post('/cadastrarDisciplina').send(disciplinaData);
    expect(disciplinaRes.status).toBe(201);
    expect(disciplinaRes.body.novaDisciplina).toBeDefined();
    disciplinaId = disciplinaRes.body.novaDisciplina.id;

    const novaNota = {
      alunoId,
      disciplinaId,
      nota: 9.5,
      dataAvaliacao: new Date(),
    };

    const res = await request(server).post('/notas').send(novaNota);
    expect(res.status).toBe(201);
    expect(res.body.nota).toBeDefined();
    expect(Number(res.body.nota.nota)).toBeCloseTo(9.5);
    expect(res.body.nota.alunoId).toBe(alunoId);
    expect(res.body.nota.disciplinaId).toBe(disciplinaId);

    notaId = res.body.nota.id;
  });

  it('deve listar todas as notas', async () => {
    const res = await request(server).get('/notas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const notas = res.body;
    const notaCriada = notas.find((n: any) => n.id === notaId);
    expect(notaCriada).toBeDefined();
    expect(Number(notaCriada.nota)).toBeCloseTo(9.5);
    expect(notaCriada.alunoId).toBe(alunoId);
    expect(notaCriada.disciplinaId).toBe(disciplinaId);
  });

  it('deve atualizar o valor de uma nota', async () => {
    const res = await request(server).put(`/notas/${notaId}`).send({ nota: 10 });
    expect(res.status).toBe(200);
    expect(res.body.nota).toBeDefined();
    expect(Number(res.body.nota.nota)).toBeCloseTo(10);
  });

  it('deve deletar a nota criada', async () => {
    const res = await request(server).delete(`/notas/${notaId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deletada/i);

    const resLista = await request(server).get('/notas');
    const notaDeletada = resLista.body.find((n: any) => n.id === notaId);
    expect(notaDeletada).toBeUndefined();
  });
});
