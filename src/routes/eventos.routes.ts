import { Router } from 'express';
import { criarEvento } from '../controllers/EventoController';
import { criarParticipante } from '../controllers/ParticipanteController';
import {
  inscreverParticipante,
  listarParticipantesPorEvento,
  listarEventosPorParticipante
} from '../controllers/InscricaoController';

const router = Router();

router.post('/eventos', criarEvento);
router.post('/participantes', criarParticipante);
router.post('/inscrever', inscreverParticipante);
router.get('/eventos/:eventoId/participantes', listarParticipantesPorEvento);
router.get('/participantes/:participanteId/eventos', listarEventosPorParticipante);

export default router;
