import { 
  Table,
  Column, 
  Model, 
  PrimaryKey, 
  AutoIncrement, 
  AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'disciplinas',
  timestamps: true,
  paranoid: true
})
export class Disciplina extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  nome!: string;
}