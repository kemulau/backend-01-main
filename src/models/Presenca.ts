import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Aluno } from './Aluno';
import { Disciplina } from './Disciplina';

@Table({
  tableName: 'presencas',
  timestamps: true,
  paranoid: true
})
export class Presenca extends Model {
  @ForeignKey(() => Aluno)
  @Column
  alunoId!: number;

  @ForeignKey(() => Disciplina)
  @Column
  disciplinaId!: number;

  @Column(DataType.DATEONLY)
  data!: Date;

  @Column(DataType.BOOLEAN)
  presente!: boolean;

  @BelongsTo(() => Aluno)
  aluno!: Aluno;

  @BelongsTo(() => Disciplina)
  disciplina!: Disciplina;
}
