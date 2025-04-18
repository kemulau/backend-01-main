import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'cursos',
  timestamps: true,
  paranoid: true
})
export class Curso extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  nome!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  descricao!: string;
}
