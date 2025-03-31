import {
    Table, Column, Model, PrimaryKey, AutoIncrement, AllowNull,
    BelongsToMany
  } from 'sequelize-typescript';
  import { Participante } from './Participante';
  import { EventoParticipante } from './EventoParticipante';
  
  @Table
  export class Evento extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;
  
    @AllowNull(false)
    @Column
    nome!: string;
  
    @AllowNull(false)
    @Column
    data!: Date;
  
    @BelongsToMany(() => Participante, () => EventoParticipante)
    participantes!: Participante[];
  }
  