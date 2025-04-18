import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Curso } from './Curso';

@Table({
  tableName: 'turmas',
  timestamps: true,
  paranoid: true
})
export class Turma extends Model {
  @Column(DataType.STRING)
  nome!: string;

  @Column(DataType.STRING)
  periodo!: string;

  @ForeignKey(() => Curso)
  @Column
  id_curso!: number;

  @BelongsTo(() => Curso)
  curso!: Curso;
}
