import { Table, Column, Model, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Evento } from './Evento';
import { EventoParticipante } from './EventoParticipante';

@Table
export class Participante extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  nome!: string;

  @HasMany(() => EventoParticipante)
  eventos!: Evento[]; 
}
