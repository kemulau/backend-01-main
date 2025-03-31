import { 
  Table, 
  Column, 
  Model, 
  PrimaryKey, 
  AutoIncrement, 
  AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'eventos',
  timestamps: true,
  paranoid: true
})
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
  data!: string;
}
