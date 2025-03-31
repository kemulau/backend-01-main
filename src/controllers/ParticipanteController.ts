import { Request, Response } from 'express';
import {Participante} from '../models/Participante';

export const criarParticipante = async (req: Request, res: Response): Promise<void> => {
  const { nome, email } = req.body;
  const participante = await Participante.create({ nome, email });
  res.status(201).json(participante);
};
