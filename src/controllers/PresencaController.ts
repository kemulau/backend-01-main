import { Request, Response } from "express";
import { Presenca } from "../models/Presenca";

export const criarPresenca = async (req: Request, res: Response) => {
  try {
    const { alunoId, disciplinaId, data, presente } = req.body;

    const presenca = await Presenca.create({
      alunoId,
      disciplinaId,
      data,
      presente
    });

    return res.status(201).json({ message: "Presença registrada com sucesso.", presenca });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao registrar presença." });
  }
};

export const listarPresencas = async (_: Request, res: Response) => {
  try {
    const presencas = await Presenca.findAll();
    return res.json(presencas);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar presenças." });
  }
};

export const buscarPresencaPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const presenca = await Presenca.findByPk(id);

    if (!presenca) {
      return res.status(404).json({ error: "Presença não encontrada." });
    }

    return res.status(200).json(presenca);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar presença." });
  }
};

export const atualizarPresenca = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { alunoId, disciplinaId, data, presente } = req.body;

    const presenca = await Presenca.findByPk(id);
    if (!presenca) return res.status(404).json({ error: "Presença não encontrada." });

    await presenca.update({ alunoId, disciplinaId, data, presente });

    return res.json({ message: "Presença atualizada com sucesso.", presenca });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar presença." });
  }
};

export const deletarPresenca = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const excluido = await Presenca.destroy({ where: { id } });

    if (!excluido) return res.status(404).json({ error: "Presença não encontrada." });

    return res.json({ message: "Presença deletada com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar presença." });
  }
};
