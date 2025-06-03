import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';
import { Professor } from '../models/Professor';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.setTimeout(20000); 

let tokenProfessor: string;
let notaId: number;
let alunoId: number;
let disciplinaId: number;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const senhaHash = await bcrypt.hash('123456', 10);
  const professor = await Professor.create({
    nome: 'Prof Nota',
    email: 'profnota@example.com',
    matricula: 'PROF999',
    senha: senhaHash,
    tipo: 'professor'
  });

  const payload = { id: professor.id, nome: professor.nome, tipo: professor.tipo };
  tokenProfessor = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '2h' });

  const alunoRes = await request(server).post('/cadastrarAluno').send({
    nome: 'Aluno Nota',
    email: 'alunonota@example.com',
    matricula: 'ALU999',
    senha: '123456'
  });
  alunoId = alunoRes.body.novoAluno?.id || alunoRes.body.aluno?.id;

  const discRes = await request(server)
    .post('/cadastrarDisciplina')
    .set('Authorization', `Bearer ${tokenProfessor}`)
    .send({
      nome: 'Lógica de Programação'
    });

  disciplinaId = discRes.body.novaDisciplina?.id || discRes.body.disciplina?.id;
});

describe('🧪 CRUD Nota (com autenticação de professor)', () => {
  it('✅ Deve criar uma nota', async () => {
    const res = await request(server)
      .post('/notas')
      .set('Authorization', `Bearer ${tokenProfessor}`)
      .send({ alunoId, disciplinaId, nota: 8.5 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('nota');
    expect(res.body.nota.nota).toBe(8.5);
    notaId = res.body.nota.id;
  });

  it('📋 Deve listar todas as notas', async () => {
    const res = await request(server)
      .get('/notas')
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('✏️ Deve atualizar uma nota', async () => {
    const novaNota = 9.0;
    const res = await request(server)
      .put(`/notas/${notaId}`)
      .set('Authorization', `Bearer ${tokenProfessor}`)
      .send({ nota: novaNota });

    expect(res.status).toBe(200);
    expect(Number(res.body.nota.nota)).toBe(novaNota);
  });

  it('🗑️ Deve deletar a nota', async () => {
    const res = await request(server)
      .delete(`/notas/${notaId}`)
      .set('Authorization', `Bearer ${tokenProfessor}`);

    expect(res.status).toBe(200);
    expect(res.body.mensagem || res.body.message || '').toMatch(/deletada/i);
  });
});
