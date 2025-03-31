import { Request, Response } from 'express';
import { Evento }  from '../models/Evento';

export const criarEvento = async (req: Request, res: Response): Promise<void> => {
  const { nome, data } = req.body;
  const evento = await Evento.create({ nome, data });
  res.status(201).json(evento);
};
