import request from 'supertest';
import server from '../server';

describe('Testes do AlunoController', () => {
  let alunoId: number;

  it('deve cadastrar um novo aluno com sucesso', async () => {
    const response = await request(server)
      .post('/cadastrarAluno')
      .send({
        nome: 'Kemulau',
        email: 'kemulau@gmail.com',
        matricula: '20230000',
      });
    alunoId = response.body.novoAluno.id;
    expect(response.status).toBe(201);
  });

  it('deve cadastrar outro aluno', async () => {
    const response = await request(server)
      .post('/cadastrarAluno')
      .send({
        nome: 'Joana Teste',
        email: 'joana.teste@gmail.com',
        matricula: '20230001'
      });
    expect(response.status).toBe(201);
  });

  it('deve retornar lista de alunos', async () => {
    const response = await request(server).get('/listarTodosAlunos');
    console.log('📋 Lista de alunos:', response.status, response.body.length);
    expect(response.status).toBe(200);
  });

  it('deve atualizar um aluno', async () => {
    const response = await request(server)
      .put(`/atualizarAluno/${alunoId}`)
      .send({
        nome: 'Aluno Atualizado',
        email: 'atualizado@gmail.com',
        matricula: 'MAT002',
      });
    console.log(' Atualizar aluno:', response.status, response.body);
    expect(response.status).toBe(200);
  });

  it('deve deletar um aluno', async () => {
    const response = await request(server)
      .delete(`/alunos/${alunoId}`);
    console.log('Deletar aluno:', response.status, response.body);
    expect(response.status).toBe(200);
  });

  it('deve cadastrar presença e nota e retornar dados completos do aluno', async () => {
    const disciplinaResponse = await request(server)
      .post('/cadastrarDisciplina')
      .send({ nome: `Lógica de Programação ${Date.now()}` });

    const disciplinaId = disciplinaResponse.body.novaDisciplina.id;

    const alunoResponse = await request(server)
      .post('/cadastrarAluno')
      .send({
        nome: 'Lucas Prado',
        email: 'lucas.prado@gmail.com',
        matricula: `${Date.now()}`
      });
    const novoAlunoId = alunoResponse.body.novoAluno.id;

    await request(server)
      .post('/vincularAlunoDisciplina')
      .send({
        alunoId: novoAlunoId,
        disciplinaId: disciplinaId
      });

    await request(server)
      .post('/cadastrarNota')
      .send({
        alunoId: novoAlunoId,
        disciplinaId,
        nota: 8.0
      });

    const presencas = [true, true, true, true];
    for (let presente of presencas) {
      await request(server)
        .post('/registrarPresenca')
        .send({
          alunoId: novoAlunoId,
          disciplinaId,
          presente
        });
    }

  });
});
