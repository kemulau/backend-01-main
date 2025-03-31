import { Router } from 'express';
import {
criarEvento ,
atualizarEvento, 
deletarEvento} from '../controllers/EventoController';
import { 
criarParticipante,
atualizarParticipante,
deletarParticipante } from '../controllers/ParticipanteController';
import {
inscreverParticipante,
listarParticipantesPorEvento,
listarEventosPorParticipante} from '../controllers/InscricaoController';

const router = Router();

router.post('/eventos', criarEvento);
router.put('/atualizarEvento/:EventoId', atualizarEvento);
router.delete('/deletarEvento/:EventoId', deletarEvento);
router.post('/participantes', criarParticipante);
router.put('/atualizarParticipante/:participanteId', atualizarParticipante);
router.delete('/deletarParticipante/:ParticipanteId', deletarParticipante);
router.post('/inscrever', inscreverParticipante);
router.get('/eventos/:eventoId/participantes', listarParticipantesPorEvento);
router.get('/participantes/:participanteId/eventos', listarEventosPorParticipante);

export default router;
