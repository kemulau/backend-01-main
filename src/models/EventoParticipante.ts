import { Table, Column, Model, PrimaryKey, AutoIncrement, ForeignKey } from 'sequelize-typescript';
import { Evento } from './Evento';
import { Participante } from './Participante';

@Table
export class EventoParticipante extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => Evento)
  @Column
  eventoId!: number;

  @ForeignKey(() => Participante)
  @Column
  participanteId!: number;
}
