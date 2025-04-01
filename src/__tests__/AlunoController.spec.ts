import request from 'supertest';
import server from '../server';
import { sequelize } from '../instances/mysql';

it('deve cadastrar um novo aluno com sucesso', async () => {
    const novoAluno = {
      nome: 'Kemulau',
      email: 'kemulau@auau.com',
      matricula: '20230000'
    };
  
    const response = await request(server)
      .post('/cadastrarAluno')
      .send(novoAluno);
  
    expect(response.status).toBe(201); 
    expect(response.body.novoAluno).toHaveProperty('id');
    expect(response.body.novoAluno.nome).toBe('Kemulau');
    expect(response.body.novoAluno.email).toBe('kemulau@auau.com');
    expect(response.body.novoAluno.matricula).toBe('20230000');
  }); 
  
  it('deve retornar lista de alunos', async () => {
    const response = await request(server).get('/listarTodosAlunos'); 
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0); 
  });
  