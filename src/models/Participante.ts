import { 
Table, 
Column, 
Model, 
PrimaryKey, 
AutoIncrement, 
AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'participantes',
  timestamps: true,
  paranoid: true
})
export class Participante extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  nome!: string;

  @AllowNull(false)
  @Column
  email!: string;
}
  