import { Table, Column, Model, PrimaryKey, AutoIncrement, ForeignKey } from 'sequelize-typescript';
import { Aluno } from './Aluno';
import { Disciplina } from './Disciplina';

@Table
export class AlunoDisciplina extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => Aluno)
  @Column
  alunoId!: number;

  @ForeignKey(() => Disciplina)
  @Column
  disciplinaId!: number;
}
