import { Request, Response } from "express";
import { Aluno } from "../models/Aluno";
import { Disciplina } from "../models/Disciplina";

// Cadastrar disciplina
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
  