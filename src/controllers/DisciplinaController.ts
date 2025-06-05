import { Request, Response } from "express";
import { Aluno } from "../models/Aluno";
import { Nota } from "../models/Nota";
import { Presenca } from "../models/Presenca";
import { AlunoDisciplina } from "../models/AlunoDisciplina";
import { Disciplina } from "../models/Disciplina";

export const cadastrarDisciplina = async (req: Request, res: Response): Promise<void> => {
  const { nome } = req.body;

  if (!nome) {
    res.status(400).json({ error: "Nome da disciplina não enviado." });
    return;
  }

  try {
    const existente = await Disciplina.findOne({ where: { nome } });

    if (existente) {
      res.status(400).json({ error: "Nome da disciplina já existe." });
      return;
    }

    const novaDisciplina = await Disciplina.create({ nome });
    res.status(201).json({
      message: "Disciplina cadastrada com sucesso.",
      novaDisciplina
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar disciplina.", details: error });
  }
};

export const atualizarDisciplina = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const dadosAtualizados = req.body;

  try {
    const disciplina = await Disciplina.findByPk(id);
    if (!disciplina) {
      res.status(404).json({ error: "Disciplina não encontrada." });
      return;
    }

    await disciplina.update(dadosAtualizados, { fields: Object.keys(dadosAtualizados) });

    res.status(200).json({ message: "Disciplina atualizada com sucesso.", disciplina });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar disciplina.", details: error });
  }
};

export const deletarDisciplina = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const matriculas = await AlunoDisciplina.findOne({ where: { disciplinaId: id } });

    if (matriculas) {
      return res.status(400).json({ mensagem: 'Disciplina possui alunos matriculados e não pode ser excluída.' });
    }

    const deletado = await Disciplina.destroy({ where: { id } });

    if (deletado) {
      res.status(200).json({ mensagem: 'Disciplina excluída com sucesso.' });
    } else {
      res.status(404).json({ mensagem: 'Disciplina não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao excluir disciplina.', error });
  }
};

export const buscarDisciplinaPorId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const disciplina = await Disciplina.findByPk(id);

    if (disciplina) {
      return res.status(200).json(disciplina);
    } else {
      return res.status(404).json({ mensagem: 'Disciplina não encontrada.' });
    }
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao buscar disciplina.', erro });
  }
};
export const listarDisciplinas = async (req: Request, res: Response) => {
  try {
    const disciplinas = await Disciplina.findAll(); 
    res.json(disciplinas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar disciplinas' });
  }
};
export const alunosReprovados = async (req: Request, res: Response) => {
  // Extrai o ID da disciplina a partir dos parâmetros da rota
  const { id } = req.params;

  try {
    // Busca todas as notas lançadas  e registros de presença para esta disciplina
    const notas = await Nota.findAll({ where: { disciplinaId: Number(id) } });
    const presencas = await Presenca.findAll({ where: { disciplinaId: Number(id) } });

    // Se não houver registros nem de notas nem de presenças, retorna 404
    if (!notas.length && !presencas.length) {
      return res.status(404).json({ mensagem: 'Nenhum dado de nota ou presença encontrado.' });
    }

    // Mapa para acumular, por aluno, suas notas e estatísticas de presença
    // chave: alunoId
    // valor: { notas: array de notas, total: qtd de registros, presentes: qtd de presenças verdadeiras }
    const alunosMap = new Map<number, { notas: number[]; total: number; presentes: number }>();

    // Percorre todas as notas e adiciona ao array de notas do respectivo aluno
    for (const nota of notas) {
      if (!alunosMap.has(nota.alunoId)) {
        alunosMap.set(nota.alunoId, { notas: [], total: 0, presentes: 0 });
      }
      alunosMap.get(nota.alunoId)!.notas.push(Number(nota.nota));
    }

    // Percorre todos os registros de presença e atualiza total e presentes para cada aluno
    for (const presenca of presencas) {
      if (!alunosMap.has(presenca.alunoId)) {
        // Garante que alunos sem nota mas com presença também entrem no mapa
        alunosMap.set(presenca.alunoId, { notas: [], total: 0, presentes: 0 });
      }
      const alunoData = alunosMap.get(presenca.alunoId)!;
      alunoData.total += 1;                // incrementa o total de aulas registradas
      if (presenca.presente) {
        alunoData.presentes += 1;          // incrementa apenas se estiver marcado como presente
      }
    }

    // Filtra apenas os alunos que não atingiram média ≥ 7 ou presença ≥ 75%
    const reprovadosIds = Array.from(alunosMap.entries())
      .filter(([_, dados]) => {
        // Calcula a média das notas (0 se não houver nenhuma)
        const media = dados.notas.length
          ? dados.notas.reduce((a, b) => a + b, 0) / dados.notas.length
          : 0;

        // Calcula percentual de presença (0 se não houve registro)
        const frequencia = dados.total
          ? (dados.presentes / dados.total) * 100
          : 0;

        // Retorna true para quem reprovar em nota OU em frequência
        return media < 7 || frequencia < 75;
      })
      .map(([alunoId]) => alunoId);  // extrai só os IDs dos alunos reprovados

    if (!reprovadosIds.length) {
      return res.status(200).json({ mensagem: 'Nenhum aluno reprovado'});
    }

    // Busca os dados completos dos alunos reprovados (nome, email etc)
    const alunos = await Aluno.findAll({ where: { id: reprovadosIds } });

    // Retorna lista de objetos Aluno
    return res.status(200).json(alunos);

  } catch (error) {
    return res
      .status(500).json({ error: 'Erro ao buscar reprovados.', details: error });
  }
  
};
