import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    timestamps: true,
    paranoid: true
})
export class Professor extends Model {
  @Column(DataType.STRING)
  nome!: string;

  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  matricula!: string;

  @Column(DataType.STRING)
  senha!: string;
}
