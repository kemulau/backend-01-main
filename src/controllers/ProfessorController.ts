import { Request, Response } from "express";
import { Professor } from "../models/Professor";

export const criarProfessor = async (req: Request, res: Response) => {
  try {
    const { nome, email, matricula, senha } = req.body;

    const professor = await Professor.create({
      nome,
      email,
      matricula,
      senha
    });

    return res.status(201).json({ message: "Professor criado com sucesso.", professor });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar professor." });
  }
};

export const listarProfessores = async (_: Request, res: Response) => {
  try {
    const professores = await Professor.findAll();
    return res.json(professores);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar professores." });
  }
};

export const buscarProfessorPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const professor = await Professor.findByPk(id);

    if (!professor) {
      return res.status(404).json({ error: "Professor não encontrado." });
    }

    return res.status(200).json(professor);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar professor." });
  }
};

export const atualizarProfessor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, email, matricula, senha } = req.body;

    const professor = await Professor.findByPk(id);
    if (!professor) return res.status(404).json({ error: "Professor não encontrado." });

    await professor.update({ nome, email, matricula, senha });

    return res.json({ message: "Professor atualizado com sucesso.", professor });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar professor." });
  }
};

export const deletarProfessor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const excluido = await Professor.destroy({ where: { id } });

    if (!excluido) return res.status(404).json({ error: "Professor não encontrado." });

    return res.json({ message: "Professor deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar professor." });
  }
};
