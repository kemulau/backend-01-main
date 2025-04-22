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

    expect(response.status).toBe(201);
    alunoId = response.body.novoAluno.id;
  });

  it('deve cadastrar outro aluno', async () => {
    const response = await request(server)
      .post('/cadastrarAluno')
      .send({
        nome: 'Joana Teste',
        email: 'joana.teste@gmail.com',
        matricula: '20230001',
      });
    expect(response.status).toBe(201);
  });

  it('deve retornar lista de alunos', async () => {
    const response = await request(server).get('/listarTodosAlunos');
    console.log('Lista de alunos:', response.status, response.body.length);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('deve atualizar um aluno', async () => {
    const response = await request(server)
      .put(`/atualizarAluno/${alunoId}`)
      .send({
        nome: 'Aluno Atualizado',
        email: 'atualizado@gmail.com',
        matricula: 'MAT002',
      });

    console.log('Atualizar aluno:', response.status, response.body);
    expect(response.status).toBe(200);
    expect(response.body.aluno.nome).toBe('Aluno Atualizado');
  });

  it('deve deletar um aluno', async () => {
    const response = await request(server)
      .delete(`/alunos/${alunoId}`);

    console.log('Deletar aluno:', response.status, response.body);
    expect(response.status).toBe(200);
    expect(response.body.mensagem).toMatch(/excluído/i);
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

    const vinculo = await request(server)
      .post('/vincularAlunoDisciplina')
      .send({ alunoId: novoAlunoId, disciplinaId });

    expect(vinculo.status).toBe(200);

    const nota = await request(server)
      .post('/notas')
      .send({ alunoId: novoAlunoId, disciplinaId, nota: 8.0 });

    expect(nota.status).toBe(201);

    const presencas = [true, true, true, true];
    for (let presente of presencas) {
      await request(server)
        .post('/presencas')
        .send({ alunoId: novoAlunoId, disciplinaId, presente });
    }

    const situacao = await request(server).get(`/alunos/${novoAlunoId}/situacao`);
    expect(situacao.status).toBe(200);
    expect(situacao.body.nome).toBe('Lucas Prado');
    expect(situacao.body.email).toBe('lucas.prado@gmail.com');
    expect(Array.isArray(situacao.body.situacoes)).toBe(true);
    expect(situacao.body.situacoes.length).toBeGreaterThan(0);
    expect(situacao.body.situacoes[0].status).toBe('Aprovado');
  });
});
