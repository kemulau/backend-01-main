import { Request, Response } from 'express';
import {Participante} from '../models/Participante';

export const criarParticipante = async (req: Request, res: Response): Promise<void> => {
  const { nome, email } = req.body;
  const participante = await Participante.create({ nome, email });
  res.status(201).json(participante);
};

export const atualizarParticipante = async (req: Request, res: Response): Promise<void> => {
  try {
    const { participanteId } = req.params;
    const dadosAtualizados = req.body; 
    const participante = await Participante.findByPk(participanteId);
    if (!participante) {
      res.status(404).json({ error: "Participante não encontrado." });
      return 
    }

    await participante.update(dadosAtualizados, { fields: Object.keys(dadosAtualizados) });

    res.status(200).json({ message: "Participante atualizado com sucesso.", participante });
    return 
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar participante.", error });
  }
};

export const deletarParticipante = async (req: Request, res: Response): Promise<void> => {
  const { participanteId } = req.params;

  const participante = await Participante.findByPk(participanteId);

  if (participante) {
    await participante.destroy();
     res.json({ message: "Participante deletado com sucesso." });
     return
  }

   res.status(404).json({ error: "Participante não encontrado." });
   return
};
