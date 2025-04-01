import { 
  Table, 
  Column, 
  Model, 
  ForeignKey, 
  PrimaryKey,
  AutoIncrement,
  HasMany
 } from 'sequelize-typescript';
  import { Participante } from './Participante';
  import { EventoParticipante } from './EventoParticipante';

@Table
export class Evento extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  nome!: string;

  @HasMany(() => EventoParticipante)
  participantes!: Participante[];
}
