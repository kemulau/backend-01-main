import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Evento } from './Evento';
import { Participante } from './Participante';

@Table
export class EventoParticipante extends Model {
  @ForeignKey(() => Evento)
  @Column
  eventoId!: number;

  @ForeignKey(() => Participante)
  @Column
  participanteId!: number;
}
