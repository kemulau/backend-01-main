import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';

describe('Testes do ProfessorController', () => {
  let professorId: number;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve criar um novo professor', async () => {
    const novoProfessor = {
      nome: 'Wagner Weinert',
      email: 'weinert@faculdade.com',
      matricula: 'PROF123',
      senha: 'senha123'
    };

    const res = await request(server).post('/professores').send(novoProfessor);
    console.log('Cadastrar professor:', res.status, res.body);
    expect(res.status).toBe(201);
    expect(res.body.professor).toBeDefined();
    expect(res.body.professor.nome).toBe(novoProfessor.nome);
    professorId = res.body.professor.id;
  });

  it('deve buscar um professor por ID', async () => {
    const res = await request(server).get(`/professores/${professorId}`);
    console.log('Buscar professor por ID:', res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(professorId);
  });

  it('deve listar todos os professores', async () => {
    const res = await request(server).get('/professores');
    console.log('Listar professores:', res.status, res.body.length);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((p: any) => p.id === professorId)).toBe(true);
  });

  it('deve atualizar os dados de um professor', async () => {
    const atualizacao = {
      nome: 'Wagner Atualizado',
      email: 'wagner@atualizado.com',
      matricula: 'PROF999',
      senha: 'novaSenha'
    };

    const res = await request(server).put(`/professores/${professorId}`).send(atualizacao);
    console.log('Atualizar professor:', res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body.professor).toBeDefined();
    expect(res.body.professor.nome).toBe(atualizacao.nome);
    expect(res.body.professor.email).toBe(atualizacao.email);
  });

  it('deve deletar um professor', async () => {
    const res = await request(server).delete(`/professores/${professorId}`);
    console.log('Deletar professor:', res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body.message || res.body.mensagem).toMatch(/deletado/i);

    const resConsulta = await request(server).get(`/professores/${professorId}`);
    console.log('Confirmar exclusão:', resConsulta.status);
    expect(resConsulta.status).toBe(404);
  });
});
