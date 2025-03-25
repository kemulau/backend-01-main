import { Request, Response } from "express";
import { Aluno } from "../models/alunos";

export const listarAlunos = async (req: Request, res: Response) => {
    const alunos = await Aluno.findAll();
    return res.json(alunos);
}; 

export const cadastrarAluno = async (req: Request, res: Response) => {
    const { nome, email, matricula } = req.body; 

    let novoAluno = await Aluno.create({ nome, email, matricula });
    res.status(201).json({
        message: "Aluno cadastrado", 
        novoAluno
    });
};
