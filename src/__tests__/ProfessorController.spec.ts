import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';
import { Professor } from '../models/Professor';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.setTimeout(20000);

describe('🧪 CRUD Professor (apenas professor autorizado)', () => {
  let tokenProfessor: string;
  let professorId: number;

  const dadosAdmin = {
    nome: 'Admin Professor',
    email: 'admin@example.com',
    senha: '123456',
    matricula: 'ADM001',
    tipo: 'professor'
  };

  const dadosProfessorNovo = {
    nome: 'Professor Teste',
    email: 'professor1@example.com',
    senha: '123456',
    matricula: 'PROF123',
    tipo: 'aluno'
  };

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const senhaHash = await bcrypt.hash(dadosAdmin.senha, 10);
    const prof = await Professor.create({
      ...dadosAdmin,
      senha: senhaHash
    });

    tokenProfessor = jwt.sign(
      { id: prof.id, nome: prof.nome, tipo: 'professor' },
      process.env.JWT_SECRET || 'segredo123',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('✅ Deve cadastrar um professor (com autenticação)', async () => {
    const res = await request(server)
      .post('/professores')
      .set('Authorization', `Bearer ${tokenProfessor}`)
      .send(dadosProfessorNovo);

    expect(res.status).toBe(201);
    expect(res.body.professor).toHaveProperty('id');
    expect(res.body.professor.email).toBe(dadosProfessorNovo.email);

    professorId = res.body.professor.id;
  });

  it('📥 Deve buscar professor por ID (autenticado)', async () => {
    const res = await request(server)
      .get(`/professores/${professorId}`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe(dadosProfessorNovo.nome);
  });

  it('📋 Deve listar todos os professores', async () => {
    const res = await request(server)
      .get('/professores')
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('✏️ Deve atualizar o professor (com autenticação)', async () => {
    const atualizacao = {
      nome: 'Professor Atualizado',
      email: 'prof.atualizado@example.com'
    };

    const res = await request(server)
      .put(`/professores/${professorId}`)
      .set('Authorization', `Bearer ${tokenProfessor}`)
      .send(atualizacao);

    expect(res.status).toBe(200);
    expect(res.body.professor.nome).toBe(atualizacao.nome);
  });

  it('🗑️ Deve deletar o professor (com autenticação)', async () => {
    const res = await request(server)
      .delete(`/professores/${professorId}`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
    expect(res.body.mensagem).toMatch(/excluído/i);
  });

  it('❌ Deve retornar 404 ao buscar professor deletado', async () => {
    const res = await request(server)
      .get(`/professores/${professorId}`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(404);
  });
});
