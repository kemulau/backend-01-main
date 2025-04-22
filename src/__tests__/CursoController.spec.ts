import request from 'supertest';
import server from '../server';

describe('Testes do CursoController', () => {
  let cursoId: number;

  it('deve criar um novo curso', async () => {
    const novoCurso = {
      nome: 'Engenharia de Software',
      descricao: 'Curso de nível superior na área de desenvolvimento de sistemas'
    };

    const res = await request(server).post('/cursos').send(novoCurso);
    expect(res.status).toBe(201);
    expect(res.body.curso).toBeDefined();
    expect(res.body.curso.nome).toBe(novoCurso.nome);
    cursoId = res.body.curso.id;
  });

  it('deve listar todos os cursos', async () => {
    const res = await request(server).get('/cursos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const cursoCriado = res.body.find((c: any) => c.id === cursoId);
    expect(cursoCriado).toBeDefined();
    expect(cursoCriado.nome).toBe('Engenharia de Software');
  });

  it('deve atualizar um curso existente', async () => {
    const alteracao = {
      nome: 'Engenharia de Software Atualizado',
      descricao: 'Curso atualizado com nova ementa'
    };

    const res = await request(server).put(`/cursos/${cursoId}`).send(alteracao);
    expect(res.status).toBe(200);
    expect(res.body.curso).toBeDefined();
    expect(res.body.curso.nome).toBe(alteracao.nome);
    expect(res.body.curso.descricao).toBe(alteracao.descricao);
  });

  it('deve deletar um curso', async () => {
    const res = await request(server).delete(`/cursos/${cursoId}`);
    expect(res.status).toBe(200);
    expect(res.body.message || res.body.mensagem).toBe("Curso deletado com sucesso.");

    const resConsulta = await request(server).get(`/cursos/${cursoId}`);
    expect(resConsulta.status).toBe(404);
  });
});
