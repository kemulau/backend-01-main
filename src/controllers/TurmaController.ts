import { Request, Response } from "express";
import { Turma } from "../models/Turma";

export const criarTurma = async (req: Request, res: Response) => {
  try {
    const turma = await Turma.create(req.body);
    return res.status(201).json({ message: "Turma criada com sucesso.", turma });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar turma." });
  }
};

export const listarTurmas = async (_: Request, res: Response) => {
  try {
    const turmas = await Turma.findAll();
    return res.json(turmas);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar turmas." });
  }
};

export const atualizarTurma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const turma = await Turma.findByPk(id);
    if (!turma) return res.status(404).json({ error: "Turma não encontrada." });

    await turma.update(req.body);
    return res.json({ message: "Turma atualizada.", turma });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar turma." });
  }
};

export const deletarTurma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const excluido = await Turma.destroy({ where: { id } });
    if (!excluido) return res.status(404).json({ error: "Turma não encontrada." });

    return res.json({ message: "Turma deletada com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar turma." });
  }
};
