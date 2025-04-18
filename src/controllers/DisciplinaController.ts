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

export const alunosReprovados = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const notas = await Nota.findAll({ where: { disciplinaId: Number(id) } });
    const presencas = await Presenca.findAll({ where: { disciplinaId: Number(id) } });

    if (!notas.length && !presencas.length) {
      return res.status(404).json({ mensagem: 'Nenhum dado de nota ou presença encontrado.' });
    }

    const alunosMap = new Map<number, { notas: number[]; total: number; presentes: number }>();

    for (const nota of notas) {
      if (!alunosMap.has(nota.alunoId)) {
        alunosMap.set(nota.alunoId, { notas: [], total: 0, presentes: 0 });
      }
      alunosMap.get(nota.alunoId)!.notas.push(Number(nota.nota));
    }

    for (const presenca of presencas) {
      if (!alunosMap.has(presenca.alunoId)) {
        alunosMap.set(presenca.alunoId, { notas: [], total: 0, presentes: 0 });
      }
      const alunoData = alunosMap.get(presenca.alunoId)!;
      alunoData.total += 1;
      if (presenca.presente) alunoData.presentes += 1;
    }

    const reprovadosIds = Array.from(alunosMap.entries())
      .filter(([_, dados]) => {
        const media = dados.notas.length ? (dados.notas.reduce((a, b) => a + b, 0) / dados.notas.length) : 0;
        const frequencia = dados.total ? (dados.presentes / dados.total) * 100 : 0;
        return media < 7 || frequencia < 75;
      })
      .map(([alunoId]) => alunoId);

    if (!reprovadosIds.length) {
      return res.status(200).json([]);
    }

    const alunos = await Aluno.findAll({ where: { id: reprovadosIds } });

    return res.status(200).json(alunos);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar reprovados.', details: error });
  }
};
