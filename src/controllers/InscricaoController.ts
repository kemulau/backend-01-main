import { Request, Response } from 'express';
import {Evento}  from '../models/Evento';
import {Participante}  from '../models/Participante';
import  {EventoParticipante}  from '../models/EventoParticipante'

export const inscreverParticipante = async (req: Request, res: Response): Promise<void> => {
  const { eventoId, participanteId } = req.body;
  const evento = await Evento.findByPk(eventoId);
  const participante = await Participante.findByPk(participanteId);

  if (!evento || !participante) {
    res.status(404).json({ error: 'Evento ou Participante não encontrado' });
    return;
  }

  await (evento as any).addParticipante(participante);
  res.json({ message: 'Participante inscrito com sucesso!' });
};

export const listarParticipantesPorEvento = async (req: Request, res: Response): Promise<void> => {
  const { eventoId } = req.params;
  const evento = await Evento.findByPk(eventoId, { include: ['participantes'] });

  if (!evento) {
    res.status(404).json({ error: 'Evento não encontrado' });
    return;
  }

  res.json(evento.participantes);
};

export const listarEventosPorParticipante = async (req: Request, res: Response): Promise<void> => {
  const { participanteId } = req.params;
  const participante = await Participante.findByPk(participanteId, { include: ['eventos'] });

  if (!participante) {
    res.status(404).json({ error: 'Participante não encontrado' });
    return;
  }

  res.json(participante.eventos);
};
