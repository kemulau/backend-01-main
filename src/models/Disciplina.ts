import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/mysql";

export class Disciplina extends Model {
    public id!: number;
    public nome!: string;
}

Disciplina.init(
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
    },
    nome:{
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    sequelize,
    tableName:"disciplinas",
    timestamps: false,
}
);