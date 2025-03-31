import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'alunos',
  timestamps: true, // habilita createdAt e updatedAt
  paranoid: true    // habilita deletedAt (soft delete)
})
export class Aluno extends Model {
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

  @AllowNull(false)
  @Column
  matricula!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @DeletedAt
  @Column
  deletedAt!: Date;
}
