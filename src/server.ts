import express, { Request, Response, ErrorRequestHandler } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/routes';
import { conectaBanco } from './instances/mysql';
import "./models/associations";
import eventoRoutes from './routes/eventos.routes';

dotenv.config({ path: path.resolve(__dirname, './../.env') }); // <- caminho corrigido
const server = express();

// Configurações
server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, '../public')));

// Banco de dados
conectaBanco();

// Rotas
server.use(eventoRoutes);
server.use(apiRoutes);

// 404
server.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint não encontrado.' });
});

// Middleware de erro
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    res.status(400).json({ error: 'Ocorreu algum erro.' });
};
server.use(errorHandler);

// Start
if (require.main === module) {
    const port = process.env.PORT || 5001;
    server.listen(port, () => {
        console.log(`🚀 Servidor rodando na porta ${port}`);
    });
}

export default server;
