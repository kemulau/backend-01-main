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

// Vincular um aluno a uma disciplina
export const vincularAlunoDisciplina = async (req: Request, res: Response) => {
    try {
        const { alunoId, disciplinaId } = req.body;

        if (!alunoId || !disciplinaId) {
            return res.status(400).json({ error: "Dados incompletos." });
        }

        const aluno = await Aluno.findByPk(alunoId);
        const disciplina = await Disciplina.findByPk(disciplinaId);

        if (!aluno || !disciplina) {
            return res.status(404).json({ error: "Aluno ou disciplina não encontrado." });
        }

        const vinculoExistente = await aluno.hasDisciplina(disciplina);
        if (vinculoExistente) {
            return res.status(409).json({ error: "Vínculo já existente entre o aluno e a disciplina." });
        }

        await aluno.addDisciplina(disciplina);
        return res.json({ message: "Aluno vinculado à disciplina com sucesso!" });
    } catch (error) {
        console.error("Erro ao vincular aluno à disciplina:", error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
};


