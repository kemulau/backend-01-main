import { Request, Response } from "express";
import { Aluno } from "../models/Aluno";
import { AlunoDisciplina } from "../models/AlunoDisciplina";

export const cadastrarAluno = async (req: Request, res: Response): Promise<void> => {
    const { nome, email, matricula } = req.body; 

    let novoAluno = await Aluno.create({ nome, email, matricula });
    res.status(201).json({
        message: "Aluno cadastrado", 
        novoAluno
    });
};

export const listarAlunos = async (req: Request, res: Response): Promise<void> => {
    const alunos = await Aluno.findAll();
     res.json(alunos);
     return
}; 

export const atualizarAluno = async (req: Request, res: Response): Promise<void>  => {
    try {
      const { alunoId } = req.params;
      const dadosAtualizados = req.body; 
  
      const aluno = await Aluno.findByPk(alunoId);
      if (!aluno) {
      res.status(404).json({ error: "Aluno não encontrado." });
      return 
      }
  
      await aluno.update(dadosAtualizados, { fields: Object.keys(dadosAtualizados) });
  
   res.status(200).json({ message: "Aluno atualizado com sucesso.", aluno });
   return 
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar aluno.", error });
    }
  };
  
  export const deletarAluno = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      // Verifica se o aluno está matriculado em alguma disciplina
      const matriculas = await AlunoDisciplina.findOne({ where: { alunoId: id } });
  
      if (matriculas) {
        return res.status(400).json({ mensagem: 'Aluno está matriculado em uma ou mais disciplinas e não pode ser excluído.' });
      }
  
      // Exclui o aluno se não houver matrículas associadas
      const resultado = await Aluno.destroy({ where: { id } });
  
      if (resultado) {
        return res.status(200).json({ mensagem: 'Aluno excluído com sucesso.' });
      } else {
        return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
      }
    } catch (erro) {
      return res.status(500).json({ mensagem: 'Erro ao excluir aluno.', erro });
    }
  };
  
  export const buscarAlunoPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const aluno = await Aluno.findByPk(id);
  
      if (aluno) {
        return res.status(200).json(aluno);
      } else {
        return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
      }
    } catch (erro) {
      return res.status(500).json({ mensagem: 'Erro ao buscar aluno.', erro });
    }
  };