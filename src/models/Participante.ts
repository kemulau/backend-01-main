import {
    Table, Column, Model, PrimaryKey, AutoIncrement, AllowNull,
    BelongsToMany
  } from 'sequelize-typescript';
  import { Evento } from './Evento';
  import { EventoParticipante } from './EventoParticipante';
  
  @Table
  export class Participante extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;
  
    @AllowNull(false)
    @Column
    nome!: string;
  
    @AllowNull(false)
    @Column
    email!: string;
  
    @BelongsToMany(() => Evento, () => EventoParticipante)
    eventos!: Evento[];
  }
  