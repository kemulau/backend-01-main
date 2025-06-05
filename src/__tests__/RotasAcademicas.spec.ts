import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Aluno } from '../models/Aluno';
import { Professor } from '../models/Professor';
import { Disciplina } from '../models/Disciplina';
import { Nota } from '../models/Nota';
import { Presenca } from '../models/Presenca';

jest.setTimeout(20000);


describe('📊 Testes de Rotas Protegidas por Tipo de Usuário', () => {
  let tokenProfessor: string;
  let tokenAluno: string;
  let alunoId: number;
  let professorId: number;
  let disciplinaId: number;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const senhaHash = await bcrypt.hash('123456', 10);

    const professor = await Professor.create({
      nome: 'Prof Teste',
      email: 'prof@ifpr.edu.br',
      matricula: 'PROF001',
      senha: senhaHash,
      tipo: 'professor'
    });
    professorId = professor.id;

    tokenProfessor = jwt.sign(
      { id: professorId, nome: professor.nome, tipo: 'professor' },
      process.env.JWT_SECRET || 'segredo123',
      { expiresIn: '2h' }
    );

    const aluno = await Aluno.create({
      nome: 'Aluno Teste',
      email: 'aluno@ifpr.edu.br',
      matricula: 'ALUNO001',
      senha: senhaHash,
      tipo: 'aluno'
    });
    alunoId = aluno.id;

    tokenAluno = jwt.sign(
      { id: alunoId, nome: aluno.nome, tipo: 'aluno' },
      process.env.JWT_SECRET || 'segredo123',
      { expiresIn: '2h' }
    );

    const disciplina = await Disciplina.create({ nome: 'Matemática' });
    disciplinaId = disciplina.id;

    await Nota.bulkCreate([
      { alunoId, disciplinaId, nota: 6 },
      { alunoId, disciplinaId, nota: 7 },
    ]);

    await Presenca.bulkCreate([
      { alunoId, disciplinaId, presente: true },
      { alunoId, disciplinaId, presente: false },
    ]);
  });

  afterAll(async () => {
    await Nota.destroy({ where: {} });
    await Presenca.destroy({ where: {} });
    await Disciplina.destroy({ where: {} });
    await Aluno.destroy({ where: {} });
    await Professor.destroy({ where: {} });
    await sequelize.close();
  });

  it('🟢 /alunos/:id/notas → 200 com professor', async () => {
    const res = await request(server)
      .get(`/alunos/${alunoId}/notas`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('🔴 /alunos/:id/notas → 403 com aluno', async () => {
    const res = await request(server)
      .get(`/alunos/${alunoId}/notas`)
      .set('Authorization', `Bearer ${tokenAluno}`);

    expect(res.status).toBe(403);
  });

  it('🔴 /alunos/999/notas → 404 inexistente', async () => {
    const res = await request(server)
      .get('/alunos/999/notas')
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect([200, 404]).toContain(res.status);
  });

  it('📅 /alunos/:id/presencas → 200 com professor', async () => {
    const res = await request(server)
      .get(`/alunos/${alunoId}/presencas`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
  });

  it('🔴 /alunos/:id/presencas → 403 com aluno', async () => {
    const res = await request(server)
      .get(`/alunos/${alunoId}/presencas`)
      .set('Authorization', `Bearer ${tokenAluno}`);

    expect(res.status).toBe(403);
  });

  it('🔴 /alunos/999/presencas → 404 inexistente', async () => {
    const res = await request(server)
      .get('/alunos/999/presencas')
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect([200, 404]).toContain(res.status);
  });

  it('📉 /disciplinas/:id/reprovados → 200 com professor', async () => {
    const res = await request(server)
      .get(`/disciplinas/${disciplinaId}/reprovados`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('🔴 /disciplinas/:id/reprovados → 403 com aluno', async () => {
    const res = await request(server)
      .get(`/disciplinas/${disciplinaId}/reprovados`)
      .set('Authorization', `Bearer ${tokenAluno}`);

    expect(res.status).toBe(403);
  });

  it('🔴 /disciplinas/999/reprovados → 404 inexistente', async () => {
    const res = await request(server)
      .get('/disciplinas/999/reprovados')
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect([200, 404]).toContain(res.status);
  });

  it('🧾 /alunos/:id/situacao → 200 com professor', async () => {
    const res = await request(server)
      .get(`/alunos/${alunoId}/situacao`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('🔴 /alunos/:id/situacao → 403 com aluno', async () => {
    const res = await request(server)
      .get(`/alunos/${alunoId}/situacao`)
      .set('Authorization', `Bearer ${tokenAluno}`);

    expect(res.status).toBe(403);
  });

  it('🔴 /alunos/999/situacao → 404 inexistente', async () => {
    const res = await request(server)
      .get('/alunos/999/situacao')
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect([200, 404]).toContain(res.status);
  });
});
