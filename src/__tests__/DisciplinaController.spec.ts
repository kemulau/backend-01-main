import request from 'supertest';
import server from '../server';
import { Nota } from '../models/Notas';
import { Presenca } from '../models/Presenca';

describe('Testes do DisciplinaController', () => {
  let novaDisciplinaId: number;
  let alunoId: number;

  it('deve cadastrar disciplina, aluno, vincular e registrar reprovação', async () => {
    const disciplinaRes = await request(server)
      .post('/cadastrarDisciplina')
      .send({ nome: `Fundamentos de Dados ${Date.now()}` });

    expect(disciplinaRes.status).toBe(201);
    novaDisciplinaId = disciplinaRes.body.novaDisciplina.id;

    const alunoRes = await request(server)
      .post('/cadastrarAluno')
      .send({
        nome: 'Fernanda Silva',
        email: 'fernanda.silva@gmail.com',
        matricula: `${Date.now()}`
      });

    expect(alunoRes.status).toBe(201);
    alunoId = alunoRes.body.novoAluno.id;

    const vinculo = await request(server)
      .post('/vincularAlunoDisciplina')
      .send({ alunoId, disciplinaId: novaDisciplinaId });
    expect(vinculo.status).toBe(200);

    // Registra nota baixa
    await Nota.create({
      alunoId,
      disciplinaId: novaDisciplinaId,
      nota: 4.5,
      dataAvaliacao: new Date()
    });

    // Registra presenças (1 presente e 3 faltas = 25%)
    await Presenca.bulkCreate([
      { alunoId, disciplinaId: novaDisciplinaId, data: new Date(), presente: true },
      { alunoId, disciplinaId: novaDisciplinaId, data: new Date(), presente: false },
      { alunoId, disciplinaId: novaDisciplinaId, data: new Date(), presente: false },
      { alunoId, disciplinaId: novaDisciplinaId, data: new Date(), presente: false }
    ]);

    // Consulta reprovados
    const response = await request(server).get(`/disciplinas/${novaDisciplinaId}/reprovados`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const fernanda = response.body.find((a: any) => a.nome === 'Fernanda Silva');
    expect(fernanda).toBeDefined();
    expect(fernanda.email).toBe('fernanda.silva@gmail.com');
  });
});
