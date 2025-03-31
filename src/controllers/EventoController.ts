import { Request, Response } from 'express';
import { Evento }  from '../models/Evento';

export const criarEvento = async (req: Request, res: Response): Promise<void> => {
  const { nome, data } = req.body;
  const evento = await Evento.create({ nome, data });
  res.status(201).json(evento);
};

export const atualizarEvento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventoId } = req.params;
    const dadosAtualizados = req.body;

    const evento = await Evento.findByPk(eventoId);
    if (!evento) {
       res.status(404).json({ error: "Evento não encontrado." });
       return
    }

    await evento.update(dadosAtualizados, { fields: Object.keys(dadosAtualizados) });

     res.status(200).json({ message: "Evento atualizado com sucesso.", evento });
     return
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar evento.", error });
  }
};

export const deletarEvento = async (req: Request, res: Response): Promise<void> => {
  const { eventoId } = req.params;

  const evento = await Evento.findByPk(eventoId);

  if (evento) {
    await evento.destroy();
     res.json({ message: "Evento deletado com sucesso." });
     return
  }

   res.status(404).json({ error: "Evento não encontrado." });
   return
};


