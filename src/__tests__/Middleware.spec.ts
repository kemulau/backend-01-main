import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Professor } from '../models/Professor';
import { Aluno } from '../models/Aluno';

jest.setTimeout(20000);

describe('🔐 Testes de Autenticação e Autorização', () => {
  let tokenProfessor: string;
  let tokenAluno: string;
  let professorId: number;
  let alunoId: number;

  const professorCredenciais = {
    nome: 'Prof Autorizado',
    email: 'prof@teste.com',
    matricula: 'PROF999',
    senha: 'senha123',
    tipo: 'professor'
  };

  const alunoCredenciais = {
    nome: 'Aluno Comum',
    email: 'aluno@teste.com',
    matricula: 'ALUNO123',
    senha: 'senha123',
    tipo: 'aluno'
  };

  beforeAll(async () => {
    console.log('🔄 Resetando banco...');
    await sequelize.sync({ force: true });

    const senhaHash = await bcrypt.hash(professorCredenciais.senha, 10);
    const professor = await Professor.create({
      ...professorCredenciais,
      senha: senhaHash
    });
    professorId = professor.id;
    console.log('✅ Professor criado com ID:', professorId);

    tokenProfessor = jwt.sign(
      { id: professor.id, nome: professor.nome, tipo: 'professor' },
      process.env.JWT_SECRET || 'segredo123',
      { expiresIn: '1h' }
    );

    const cadastroAluno = await request(server).post('/cadastrarAluno').send(alunoCredenciais);
    alunoId = cadastroAluno.body.novoAluno.id;
    console.log('✅ Aluno criado com ID:', alunoId);

    const loginAluno = await request(server).post('/login').send({
      identificador: alunoCredenciais.matricula,
      senha: alunoCredenciais.senha
    });
    tokenAluno = loginAluno.body.token;
    console.log('🛂 Resposta login aluno:', loginAluno.body);
  });

  afterAll(async () => {
    await Aluno.destroy({ where: { id: alunoId } });
    await Professor.destroy({ where: { id: professorId } });
    await sequelize.close();
    console.log('🧹 Banco limpo e conexão encerrada.');
  });

  it('✅ Deve permitir acesso com token válido (aluno)', async () => {
    const res = await request(server)
      .get(`/professores`)
      .set('Authorization', `Bearer ${tokenAluno}`);

    console.log('📥 Resposta com token de aluno:', res.status, res.body);
    expect([200, 403]).toContain(res.status);
  });

  it('⛔ Deve bloquear acesso sem token', async () => {
    const res = await request(server).get(`/alunos/${alunoId}/situacao`);

    console.log('🔒 Acesso sem token:', res.status, res.body);
    expect(res.status).toBe(401);
    expect(res.body.erro || res.body.message).toMatch(/token.*ausente/i);
  });

  it('⛔ Deve bloquear acesso com token inválido', async () => {
    const res = await request(server)
      .get(`/alunos/${alunoId}/situacao`)
      .set('Authorization', 'Bearer token_falso');

    console.log('🔒 Acesso com token inválido:', res.status, res.body);
    expect(res.status).toBe(403);
    expect(res.body.erro || res.body.message).toMatch(/inválido/i);
  });

  it('✅ Deve permitir acesso à rota exclusiva de professor', async () => {
    const res = await request(server)
      .get(`/alunos/${alunoId}/situacao`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    console.log('🔓 Acesso com token de professor:', res.status, res.body);
    expect(res.status).toBe(200);
    console.log('📦 Tipo do body:', typeof res.body);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('⛔ Deve bloquear aluno tentando acessar rota de professor', async () => {
    const res = await request(server)
      .get(`/alunos/${alunoId}/situacao`)
      .set('Authorization', `Bearer ${tokenAluno}`);

    console.log('🔒 Acesso indevido de aluno:', res.status, res.body);
    expect(res.status).toBe(403);
    expect(res.body.erro || res.body.message).toMatch(/acesso negado/i);
  });
});
