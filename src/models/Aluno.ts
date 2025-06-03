import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
   BeforeCreate,
  BeforeUpdate
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';

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

  @AllowNull(false)
  @Column
  senha!: string; 

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
  
  @Column
  tipo!: string; 

  @DeletedAt
  @Column
  deletedAt!: Date;
    // 🔐 Hook para criptografar senha antes de criar/atualizar
  @BeforeCreate
  @BeforeUpdate
  static async criptografarSenha(aluno: Aluno) {
    if (aluno.changed('senha')) {
      aluno.senha = await bcrypt.hash(aluno.senha, 10);
    }
  }
}

