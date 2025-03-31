import { Request, Response } from "express";
import { Aluno } from "../models/Aluno";
import { Disciplina } from "../models/Disciplina";

export const cadastrarDisciplina = async (req: Request, res: Response): Promise<void> => {
    const { nome } = req.body;
  
    if (nome) {
      let disciplinaExistente = await Disciplina.findOne({ where: { nome } });
  
      if (!disciplinaExistente) {
        let novaDisciplina = await Disciplina.create({ nome });
  
        res.status(201);
         res.json({
          message: "Disciplina cadastrada com sucesso.",
          novaDisciplina
        });
        return

      } else {
         res.status(400).json({ error: "Nome da disciplina já existe." });
         return
      }
    }
  
     res.status(400).json({ error: "Nome da disciplina não enviado." });
     return
    };

export const atualizarDisciplina = async (req: Request, res: Response): Promise<void> => {
  try {
    const { disciplinaID } = req.params;
    const dadosAtualizados = req.body; 

    const disciplina = await Disciplina.findByPk(disciplinaID);
    if (!disciplina) {
      res.status(404).json({ error: "Aluno não encontrado." }); return
    }

    await disciplina.update(dadosAtualizados, { fields: Object.keys(dadosAtualizados) });

     res.status(200).json({ message: "Disciplina atualizada com sucesso.", disciplina });return
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar Disciplina.", error });
  }
};

  