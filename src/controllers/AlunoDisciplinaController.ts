import { Request, Response } from "express";
import { Aluno } from "../models/Aluno";
import { Disciplina } from "../models/Disciplina";
import { AlunoDisciplina } from "../models/AlunoDisciplina";

export const listarDisciplinasDoAluno = async (req: Request, res: Response): Promise<void> => {
    const { alunoId } = req.params;
    const aluno = await Aluno.findByPk(alunoId, {
        include: [{ model: Disciplina }]
    });

    if (aluno) {
        res.json(aluno);
        return
    }
     res.status(404).json({ error: "Aluno não encontrado" });
     return
};

export const vincularAlunoDisciplina = async (req: Request, res: Response): Promise<void> => {
    try {
        const { alunoId, disciplinaId } = req.body;

        if (!alunoId || !disciplinaId) {
             res.status(400).json({ error: "Dados incompletos." });
             return
        }

        const aluno = await Aluno.findByPk(alunoId);
        const disciplina = await Disciplina.findByPk(disciplinaId);

        if (!aluno || !disciplina) {
             res.status(404).json({ error: "Aluno ou disciplina não encontrado." });
             return
        }

        if (await (aluno as any).hasDisciplina(disciplina)) {
            res.status(409).json({ error: "Vínculo já existente entre o aluno e a disciplina." });
            return;
          }
          
          await (aluno as any).addDisciplina(disciplina);
          res.json({ message: "Aluno vinculado à disciplina com sucesso!" });
          
    } catch (error) {
        console.error("Erro ao vincular aluno à disciplina:", error);
        res.status(500).json({ error: "Erro interno no servidor." });
        return
    }
};


