import { Request, Response } from "express";
import { Nota } from "../models/Nota";

export const criarNota = async (req: Request, res: Response) => {
  try {
    const { alunoId, disciplinaId, nota, dataAvaliacao } = req.body;

    const novaNota = await Nota.create({
      alunoId,
      disciplinaId,
      nota,
      dataAvaliacao: dataAvaliacao || new Date() // usa data atual se não enviada
    });

    return res.status(201).json({ message: "Nota cadastrada com sucesso.", nota: novaNota });
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
    const { alunoId, disciplinaId, nota, dataAvaliacao } = req.body;

    const notaEncontrada = await Nota.findByPk(id);
    if (!notaEncontrada) return res.status(404).json({ error: "Nota não encontrada." });

    await notaEncontrada.update({
      alunoId,
      disciplinaId,
      nota,
      dataAvaliacao
    });

    return res.json({ message: "Nota atualizada.", nota: notaEncontrada });
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
