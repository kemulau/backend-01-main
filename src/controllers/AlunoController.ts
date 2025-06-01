import { Request, Response } from "express";
import { Aluno } from "../models/Aluno";
import { Nota } from '../models/Nota';
import { Presenca } from '../models/Presenca';
import { Disciplina } from '../models/Disciplina';
import { AlunoDisciplina } from "../models/AlunoDisciplina";
import { enviarEmail } from '../services/emailService';


export const cadastrarAluno = async (req: Request, res: Response): Promise<void> => {
  const { nome, email, matricula, senha } = req.body;

  try {
    const novoAluno = await Aluno.create({ nome, email, matricula, senha });
    await enviarEmail(nome, email);

    res.status(201).json({
      message: "Aluno cadastrado com sucesso e e-mail enviado.",
      novoAluno
    });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    res.status(500).json({ message: "Erro ao cadastrar aluno.", error });
  }
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

  export const listarNotasComMedia = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const notas = await Nota.findAll({
        where: { alunoId: Number(id) },
        include: [Disciplina],
      });
  
      const resultado: { disciplina: string; notas: number[]; media: number }[] = [];
  
      const disciplinasMap = new Map<number, { disciplina: string; notas: number[] }>();
  
      notas.forEach((nota) => {
        const disciplinaId = nota.disciplinaId;
        const nomeDisciplina = nota.disciplina?.nome || 'Desconhecida';
  
        if (!disciplinasMap.has(disciplinaId)) {
          disciplinasMap.set(disciplinaId, { disciplina: nomeDisciplina, notas: [] });
        }
  
        disciplinasMap.get(disciplinaId)?.notas.push(Number(nota.nota));
      });
  
      disciplinasMap.forEach((value) => {
        const media = value.notas.reduce((acc, curr) => acc + curr, 0) / value.notas.length;
        resultado.push({ ...value, media });
      });
  
      return res.json(resultado);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar notas.' });
    }
  };

  export const percentualPresenca = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const presencas = await Presenca.findAll({
        where: { alunoId: Number(id) },
        include: [Disciplina],
      });
  
      const resultado: { disciplina: string; percentual: string }[] = [];
  
      const disciplinasMap = new Map<number, { disciplina: string; total: number; presentes: number }>();
  
      presencas.forEach((presenca) => {
        const disciplinaId = presenca.disciplinaId;
        const nomeDisciplina = presenca.disciplina?.nome || 'Desconhecida';
  
        if (!disciplinasMap.has(disciplinaId)) {
          disciplinasMap.set(disciplinaId, { disciplina: nomeDisciplina, total: 0, presentes: 0 });
        }
  
        const data = disciplinasMap.get(disciplinaId)!;
        data.total += 1;
        if (presenca.presente) data.presentes += 1;
      });
  
      disciplinasMap.forEach((value) => {
        const percentual = ((value.presentes / value.total) * 100).toFixed(1) + '%';
        resultado.push({ disciplina: value.disciplina, percentual });
      });
  
      return res.json(resultado);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao calcular presença.' });
    }
  };

  export const situacaoAluno = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const aluno = await Aluno.findByPk(id);
      if (!aluno) return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
  
      const notas = await Nota.findAll({
        where: { alunoId: Number(id) },
        include: [Disciplina],
      });
  
      const presencas = await Presenca.findAll({ where: { alunoId: Number(id) } });
  
      const resultado: {
        disciplina: string;
        media: number;
        presenca: number;
        status: string;
      }[] = [];
  
      const mapaNotas = new Map<number, number[]>();
      const mapaPresencas = new Map<number, { total: number; presentes: number }>();
  
      notas.forEach((nota) => {
        if (!mapaNotas.has(nota.disciplinaId)) mapaNotas.set(nota.disciplinaId, []);
        mapaNotas.get(nota.disciplinaId)!.push(Number(nota.nota));
      });
  
      presencas.forEach((p) => {
        if (!mapaPresencas.has(p.disciplinaId)) {
          mapaPresencas.set(p.disciplinaId, { total: 0, presentes: 0 });
        }
        const data = mapaPresencas.get(p.disciplinaId)!;
        data.total += 1;
        if (p.presente) data.presentes += 1;
      });
  
      mapaNotas.forEach((notasArr, disciplinaId) => {
        const media = notasArr.reduce((a, b) => a + b, 0) / notasArr.length;
        const presencaData = mapaPresencas.get(disciplinaId);
        const presenca = presencaData
          ? (presencaData.presentes / presencaData.total) * 100
          : 0;
  
        const status = media >= 7 && presenca >= 75 ? 'Aprovado' : 'Reprovado';
        const nome = notas.find(n => n.disciplinaId === disciplinaId)?.disciplina?.nome || 'Desconhecida';
  
        resultado.push({
          disciplina: nome,
          media: Number(media.toFixed(2)),
          presenca: Number(presenca.toFixed(1)),
          status
        });
      });
  
      return res.status(200).json({
        nome: aluno.nome,
        email: aluno.email,
        situacoes: resultado
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao verificar situação.' });
    }
  };
  
  
  