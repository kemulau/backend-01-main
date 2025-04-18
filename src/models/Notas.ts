import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Aluno } from './Aluno';
import { Disciplina } from './Disciplina';

@Table({
  tableName: 'notas',
  timestamps: true,
  paranoid: true
})
export class Nota extends Model {
  @ForeignKey(() => Aluno)
  @Column
  alunoId!: number;

  @ForeignKey(() => Disciplina)
  @Column
  disciplinaId!: number;

  @Column(DataType.DECIMAL(5,2))
  nota!: number;

  @Column(DataType.DATEONLY)
  data_avaliacao!: Date;

  @BelongsTo(() => Aluno)
  aluno!: Aluno;

  @BelongsTo(() => Disciplina)
  disciplina!: Disciplina;
}
