import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';

describe('Testes do DisciplinaController', () => {
  let disciplinaId: number;

  beforeAll(async () => {

    const response = await request(server)
      .post('/cadastrarDisciplina')
      .send({ nome: 'Mineração de Dados' });

    disciplinaId = response.body.novaDisciplina.id;
  });

  it('deve cadastrar uma nova disciplina com sucesso', async () => {
    const response = await request(server)
      .post('/cadastrarDisciplina')
      .send({ nome: 'Desenvolvimento Backend' });

    expect(response.status).toBe(201);
    expect(response.body.novaDisciplina).toHaveProperty('id');
    expect(response.body.novaDisciplina.nome).toBe('Desenvolvimento Backend');
  });

  it('deve atualizar uma disciplina', async () => {
    const response = await request(server)
      .put(`/atualizarDisciplina/${disciplinaId}`)
      .send({ nome: 'Mineração de Dados Atualizada' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Disciplina atualizada com sucesso.');
    expect(response.body.disciplina.nome).toBe('Mineração de Dados Atualizada');
  });

  it('deve deletar uma disciplina', async () => {
    const response = await request(server)
      .delete(`/disciplinas/${disciplinaId}`);

    expect(response.status).toBe(200);
    expect(response.body.mensagem).toBe('Disciplina excluída com sucesso.');
  });
});
