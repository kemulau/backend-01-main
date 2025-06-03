import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';
import { Professor } from '../models/Professor';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.setTimeout(20000); // aumenta o tempo para execução do beforeAll

let tokenProfessor: string;
let presencaId: number;
let alunoId: number;
let disciplinaId: number;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const senhaHash = await bcrypt.hash('123456', 10);
  const professor = await Professor.create({
    nome: 'Prof Presença',
    email: 'profpresenca@example.com',
    matricula: 'PROF888',
    senha: senhaHash,
    tipo: 'professor'
  });

  const payload = { id: professor.id, nome: professor.nome, tipo: professor.tipo };
  tokenProfessor = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '2h' });

  const alunoRes = await request(server).post('/cadastrarAluno').send({
    nome: 'Aluno Presença',
    email: 'alunopresenca@example.com',
    matricula: 'ALU888',
    senha: '123456'
  });

  alunoId = alunoRes.body.novoAluno?.id || alunoRes.body.aluno?.id;

  const discRes = await request(server)
    .post('/cadastrarDisciplina')
    .set('Authorization', `Bearer ${tokenProfessor}`)
    .send({
      nome: 'Estrutura de Dados'
    });

  disciplinaId = discRes.body.novaDisciplina?.id || discRes.body.disciplina?.id;
});

describe('🧪 CRUD Presença (com autenticação de professor)', () => {
  it('✅ Deve registrar uma presença', async () => {
    const res = await request(server)
      .post('/presencas')
      .set('Authorization', `Bearer ${tokenProfessor}`)
      .send({
        alunoId,
        disciplinaId,
        presente: true
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('presenca');
    expect(res.body.presenca.presente).toBe(true);
    presencaId = res.body.presenca.id;
  });

  it('📋 Deve listar todas as presenças', async () => {
    const res = await request(server)
      .get('/presencas')
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('✏️ Deve atualizar a presença', async () => {
    const res = await request(server)
      .put(`/presencas/${presencaId}`)
      .set('Authorization', `Bearer ${tokenProfessor}`)
      .send({ presente: false });

    expect(res.status).toBe(200);
    expect(res.body.presenca.presente).toBe(false);
  });

  it('🗑️ Deve deletar a presença', async () => {
    const res = await request(server)
      .delete(`/presencas/${presencaId}`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
    expect(res.body.mensagem || res.body.message || '').toMatch(/deletada/i);
  });
});
