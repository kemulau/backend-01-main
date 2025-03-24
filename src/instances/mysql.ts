import { Sequelize } from 'sequelize';
import dotenv, { config } from 'dotenv';
import { console } from 'inspector';
import { error } from 'console';

dotenv.config();

export const sequelize = new Sequelize(

    process.env.MYSQL_DB as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASSWORD as string,
    {
        dialect : 'mysql',
        port: parseInt(process.env.MYSQL_PORT as string),
        host: process.env.MYSQL_HOST
    }
);

export const conectaBanco = async () => {
    try {
         await sequelize.authenticate();
         console.log("Conectado ao banco com sucesso");
    }
    catch(error){
        console.error("erro ao conectar ao banco");
    }
    
};