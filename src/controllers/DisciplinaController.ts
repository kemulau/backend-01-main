import { Request, Response } from "express";
import { Aluno } from "../models/Aluno";
import { AlunoDisciplina } from "../models/AlunoDisciplina";
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
    const { id } = req.params;
    const dadosAtualizados = req.body; 

    const disciplina = await Disciplina.findByPk(id);
    if (!disciplina) {
      res.status(404).json({ error: "Aluno não encontrado." }); return
    }

    await disciplina.update(dadosAtualizados, { fields: Object.keys(dadosAtualizados) });

     res.status(200).json({ message: "Disciplina atualizada com sucesso.", disciplina });return
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar Disciplina.", error });
  }
};

export const deletarDisciplina = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Verifica se a disciplina possui alunos matriculados
    const matriculas = await AlunoDisciplina.findOne({ where: { disciplinaId: id } });

    if (matriculas) {
      return res.status(400).json({ mensagem: 'Disciplina possui alunos matriculados e não pode ser excluída.' });
    }

    // Exclui a disciplina se não houver alunos matriculados
    const resultado = await Disciplina.destroy({ where: { id } });

    if (resultado) {
      return res.status(200).json({ mensagem: 'Disciplina excluída com sucesso.' });
    } else {
      return res.status(404).json({ mensagem: 'Disciplina não encontrada.' });
    }
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao excluir disciplina.', erro });
  }
};

export const buscarDisciplinaPorId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const disciplina = await Disciplina.findByPk(id);

    if (disciplina) {
      return res.status(200).json(disciplina);
    } else {
      return res.status(404).json({ mensagem: 'Disciplina não encontrada.' });
    }
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao buscar disciplina.', erro });
  }
};


  