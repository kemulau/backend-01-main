import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'professores',
  timestamps: true,
  paranoid: true
})
export class Professor extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  nome!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  matricula!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  senha!: string;
}
