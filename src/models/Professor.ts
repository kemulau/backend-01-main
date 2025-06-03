import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';

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

  @Column
  tipo!: string; 

  // 🔐 Hook para criptografar a senha automaticamente
  @BeforeCreate
  @BeforeUpdate
  static async criptografarSenha(prof: Professor) {
    if (prof.changed('senha')) {
      prof.senha = await bcrypt.hash(prof.senha, 10);
    }
  }
}
