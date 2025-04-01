import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';

describe('Testes do AlunoController', () => {
  let alunoId: number;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // zera o banco
    const response = await request(server)
      .post('/cadastrarAluno')
      .send({
        nome: 'Kemulau',
        email: 'kemulau@auau.com',
        matricula: '20230000',
      });

    alunoId = response.body.novoAluno.id;
  });

  it('deve cadastrar um novo aluno com sucesso', async () => {
    const novoAluno = {
      nome: 'Joana Teste',
      email: 'joana@email.com',
      matricula: '20230001'
    };

    const response = await request(server)
      .post('/cadastrarAluno')
      .send(novoAluno);

    expect(response.status).toBe(201);
    expect(response.body.novoAluno).toHaveProperty('id');
    expect(response.body.novoAluno.nome).toBe('Joana Teste');
    expect(response.body.novoAluno.email).toBe('joana@email.com');
    expect(response.body.novoAluno.matricula).toBe('20230001');
  });

  it('deve retornar lista de alunos', async () => {
    const response = await request(server).get('/listarTodosAlunos');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('deve atualizar um aluno', async () => {
    const response = await request(server)
      .put(`/atualizarAluno/${alunoId}`)
      .send({
        nome: 'Aluno Atualizado',
        email: 'atualizado@email.com',
        matricula: 'MAT002',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Aluno atualizado com sucesso.');
  });

  it('deve deletar um aluno', async () => {
    const response = await request(server)
      .delete(`/alunos/${alunoId}`);

    expect(response.status).toBe(200);
    expect(response.body.mensagem).toBe('Aluno excluído com sucesso.');

  });
});
