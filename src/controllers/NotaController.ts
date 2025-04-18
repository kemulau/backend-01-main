import { Request, Response } from "express";
import { Nota } from "../models/Notas";

export const criarNota = async (req: Request, res: Response) => {
  try {
    const nota = await Nota.create(req.body);
    return res.status(201).json({ message: "Nota cadastrada com sucesso.", nota });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cadastrar nota." });
  }
};

export const listarNotas = async (_: Request, res: Response) => {
  try {
    const notas = await Nota.findAll();
    return res.json(notas);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar notas." });
  }
};

export const atualizarNota = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const nota = await Nota.findByPk(id);
    if (!nota) return res.status(404).json({ error: "Nota não encontrada." });

    await nota.update(req.body);
    return res.json({ message: "Nota atualizada.", nota });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar nota." });
  }
};

export const deletarNota = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const excluido = await Nota.destroy({ where: { id } });
    if (!excluido) return res.status(404).json({ error: "Nota não encontrada." });

    return res.json({ message: "Nota deletada." });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar nota." });
  }
};
