import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';
import { Aluno } from '../models/Aluno';
import { Professor } from '../models/Professor';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('🧪 CRUD Aluno (acesso do professor)', () => {
  let tokenProfessor: string;
  let alunoId: number;

  const dadosProfessor = {
    nome: 'Professor Teste',
    email: 'professor@example.com',
    senha: '123456',
    matricula: 'PROF123'
  };

  const dadosAluno = {
    nome: 'Aluno Teste',
    email: 'aluno@example.com',
    senha: '123456',
    matricula: 'ALU123',
    turmaId: 1
  };

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    // Cria turma fictícia
    await sequelize.query(`
      INSERT INTO turmas (id, nome, createdAt, updatedAt)
      VALUES (1, 'Turma Teste', NOW(), NOW())
    `);

    const senhaHash = await bcrypt.hash(dadosProfessor.senha, 10);
    const prof = await Professor.create({
      ...dadosProfessor,
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

  it('✅ Deve cadastrar um aluno (sem autenticação)', async () => {
    const res = await request(server)
      .post('/cadastrarAluno')
      .send(dadosAluno);

    console.log("Resposta cadastrar:", res.status, res.body);

    expect(res.status).toBe(201);
    expect(res.body.novoAluno).toHaveProperty('id');

    alunoId = res.body.novoAluno.id;
  });

  it('📥 Deve buscar aluno por ID (professor autenticado)', async () => {
    const res = await request(server)
      .get(`/alunos/${alunoId}`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    console.log("Resposta buscar:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe(dadosAluno.nome);
  });

  it('📋 Deve listar todos os alunos (professor autenticado)', async () => {
    const res = await request(server)
      .get('/listarTodosAlunos')
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('✏️ Deve atualizar o aluno (professor autenticado)', async () => {
    const dadosAtualizados = {
      nome: 'Aluno Atualizado',
      email: 'atualizado@example.com'
    };

    const res = await request(server)
      .put(`/atualizarAluno/${alunoId}`)
      .set('Authorization', `Bearer ${tokenProfessor}`)
      .send(dadosAtualizados);

    expect(res.status).toBe(200);
    expect(res.body.aluno.nome).toBe(dadosAtualizados.nome);
  });

  it('🗑️ Deve deletar o aluno (professor autenticado)', async () => {
    const res = await request(server)
      .delete(`/alunos/${alunoId}`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
    expect(res.body.mensagem).toMatch(/excluído/i);
  });

  it('❌ Deve retornar 404 ao buscar aluno deletado', async () => {
    const res = await request(server)
      .get(`/alunos/${alunoId}`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(404);
  });
});
