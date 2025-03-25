import { Request, Response } from "express";
import { Aluno } from "../models/alunos";
import { Disciplina } from "../models/Disciplina";

// Listar disciplinas de um aluno específico
export const listarDisciplinasDoAluno = async (req: Request, res: Response) => {
    const { alunoId } = req.params;
    const aluno = await Aluno.findByPk(alunoId, {
        include: [{ model: Disciplina }]
    });

    if (aluno) {
        return res.json(aluno);
    }

    return res.status(404).json({ error: "Aluno não encontrado" });
};