import { Request, Response } from "express";
import { Curso } from "../models/Curso";

export const criarCurso = async (req: Request, res: Response) => {
  try {
    const { nome, descricao } = req.body;

    const curso = await Curso.create({ nome, descricao });
    return res.status(201).json({ message: "Curso criado com sucesso.", curso });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar curso.", details: error });
  }
};

export const listarCursos = async (_: Request, res: Response) => {
  try {
    const cursos = await Curso.findAll();
    return res.json(cursos);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar cursos." });
  }
};

export const buscarCursoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const curso = await Curso.findByPk(id);

    if (!curso) {
      return res.status(404).json({ error: "Curso não encontrado." });
    }

    return res.status(200).json(curso);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar curso por ID." });
  }
};

export const atualizarCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    const curso = await Curso.findByPk(id);
    if (!curso) return res.status(404).json({ error: "Curso não encontrado." });

    await curso.update({ nome, descricao });
    return res.json({ message: "Curso atualizado.", curso });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar curso." });
  }
};

export const deletarCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const excluido = await Curso.destroy({ where: { id } });

    if (!excluido) return res.status(404).json({ error: "Curso não encontrado." });

    return res.json({ message: "Curso deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar curso." });
  }
};
