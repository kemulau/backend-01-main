import { 
Table, 
Column, 
Model, 
ForeignKey } from 'sequelize-typescript';
import { Aluno } from './Aluno';
import { Disciplina } from './Disciplina';

@Table({
  tableName: 'aluno_disciplinas',
  timestamps: true,
  paranoid: true
})
export class AlunoDisciplina extends Model {
  @ForeignKey(() => Aluno)
  @Column
  alunoId!: number;

  @ForeignKey(() => Disciplina)
  @Column
  disciplinaId!: number;
}
