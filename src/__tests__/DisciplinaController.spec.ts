import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';
import { Nota } from '../models/Nota';
import { Presenca } from '../models/Presenca';

describe('Testes do DisciplinaController', () => {
  let disciplinaId: number;
  let alunoId: number;

  beforeAll(async () => {
    // recria todas as tabelas
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve cadastrar disciplina, aluno, vincular e registrar reprovação', async () => {
    const disciplinaRes = await request(server)
      .post('/cadastrarDisciplina')
      .send({ nome: `Fundamentos de Dados ${Date.now()}` });
    expect(disciplinaRes.status).toBe(201);
    disciplinaId = disciplinaRes.body.novaDisciplina.id;

    const alunoRes = await request(server)
      .post('/cadastrarAluno')
      .send({
        nome: 'Fernanda Silva',
        email: 'fernanda.silva@gmail.com',
        matricula: `${Date.now()}`,
        senha: 'ferzinha123'
      });
    expect(alunoRes.status).toBe(201);
    alunoId = alunoRes.body.novoAluno.id;

    const vinculoRes = await request(server)
      .post('/vincularAlunoDisciplina')
      .send({ alunoId, disciplinaId });
    expect(vinculoRes.status).toBe(200);

    await Nota.create({
      alunoId,
      disciplinaId,
      nota: 4.5,
      dataAvaliacao: new Date()
    });

    await Presenca.bulkCreate([
      { alunoId, disciplinaId, data: new Date(), presente: true },
      { alunoId, disciplinaId, data: new Date(), presente: false },
      { alunoId, disciplinaId, data: new Date(), presente: false },
      { alunoId, disciplinaId, data: new Date(), presente: false }
    ]);

    // busca reprovados
    const reprovadosRes = await request(server)
      .get(`/disciplinas/${disciplinaId}/reprovados`);
    expect(reprovadosRes.status).toBe(200);
    expect(Array.isArray(reprovadosRes.body)).toBe(true);

    const fernanda = reprovadosRes.body.find((a: any) => a.nome === 'Fernanda Silva');
    expect(fernanda).toBeDefined();
    expect(fernanda.email).toBe('fernanda.silva@gmail.com');
  });

  it('não deve deletar disciplina com alunos vinculados (status 400)', async () => {
    const res = await request(server)
      .delete(`/disciplinas/${disciplinaId}`);
    expect(res.status).toBe(400);
    expect(res.body.mensagem).toMatch(/não pode ser excluída/i);
  });

  it('deve criar e deletar disciplina sem alunos vinculados', async () => {
    // cria uma nova disciplina isolada para teste delete
    const novoRes = await request(server)
      .post('/cadastrarDisciplina')
      .send({ nome: `Teste Exclusão ${Date.now()}` });
    expect(novoRes.status).toBe(201);
    const novaId = novoRes.body.novaDisciplina.id;

    const delRes = await request(server)
      .delete(`/disciplinas/${novaId}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.mensagem).toBe('Disciplina excluída com sucesso.');
  });
});
