import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';
import bcrypt from 'bcrypt';
import { Professor } from '../models/Professor';

describe('🔐 Testes de Autenticação e Autorização com Middleware', () => {
  let tokenProfessor: string;
  let tokenAluno: string;

  jest.setTimeout(20000); // Para evitar timeout em ambiente lento

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    console.log('✅ Banco sincronizado com sucesso.');

    const senhaHash = await bcrypt.hash('senha123', 10);

    const professor = await Professor.create({
      nome: 'Prof Autorizado',
      email: 'prof@teste.com',
      matricula: 'PROF999',
    senha: 'senha123',
      tipo: 'professor',
    });
    console.log('👨‍🏫 Professor criado:', professor.toJSON());

    const loginProf = await request(server).post('/login').send({
      identificador: professor.matricula,
      senha: 'senha123',
    });
    console.log('🧪 Status loginProf:', loginProf.status);

    tokenProfessor = loginProf.body.token;
    console.log('🔐 Token do professor:', tokenProfessor);

    const cadastroAluno = await request(server).post('/cadastrarAluno').send({
      nome: 'Aluno Comum',
      email: 'aluno@teste.com',
      matricula: 'ALUNO123',
      senha: 'senha123',
      tipo: 'aluno',
    });
    console.log('👨‍🎓 Aluno cadastrado:', cadastroAluno.body);

    const loginAluno = await request(server).post('/login').send({
      identificador: 'ALUNO123',
      senha: 'senha123',
    });
    tokenAluno = loginAluno.body.token;
    console.log('🔐 Token do aluno:', tokenAluno);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('✅ Deve permitir acesso com token válido (qualquer tipo)', async () => {
    const res = await request(server)
      .get('/protegida')
      .set('Authorization', `Bearer ${tokenAluno}`);

    console.log('🧪 Teste: acesso com token válido');
    console.log('🔎 Status:', res.status);
    console.log('📦 Resposta:', res.body);

    expect(res.status).toBe(200);
    expect(res.body.mensagem).toMatch(/acesso autorizado/i);
  });

  it('⛔ Deve bloquear acesso sem token', async () => {
    const res = await request(server).get('/protegida');

    console.log('🧪 Teste: acesso sem token');
    console.log('🔎 Status:', res.status);
    console.log('📦 Resposta:', res.body);

    expect(res.status).toBe(401);
    expect(res.body.erro).toMatch(/token ausente/i);
  });

  it('⛔ Deve bloquear acesso com token inválido', async () => {
    const res = await request(server)
      .get('/protegida')
      .set('Authorization', 'Bearer token_falso');

    console.log('🧪 Teste: acesso com token falso');
    console.log('🔎 Status:', res.status);
    console.log('📦 Resposta:', res.body);

    expect(res.status).toBe(403);
    expect(res.body.erro).toMatch(/inválido/i);
  });

  it('✅ Deve permitir acesso a rota protegida por tipo (professor)', async () => {
    const res = await request(server)
      .get('/protegida/professor')
      .set('Authorization', `Bearer ${tokenProfessor}`);

    console.log('🧪 Teste: acesso de professor à rota protegida');
    console.log('🔎 Status:', res.status);
    console.log('📦 Resposta:', res.body);

    expect(res.status).toBe(200);
    expect(res.body.mensagem).toMatch(/professor autorizado/i);
  });

  it('⛔ Deve bloquear acesso a rota protegida por tipo com aluno', async () => {
    const res = await request(server)
      .get('/protegida/professor')
      .set('Authorization', `Bearer ${tokenAluno}`);

    console.log('🧪 Teste: tentativa de aluno acessar rota de professor');
    console.log('🔎 Status:', res.status);
    console.log('📦 Resposta:', res.body);

    expect(res.status).toBe(403);
    expect(res.body.erro).toMatch(/acesso negado/i);
  });
});
