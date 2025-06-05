# Backend API 🚀

API desenvolvida com **Node.js**, **Express**, **TypeScript** e **Sequelize**, que gerencia dados educacionais e eventos com relacionamentos complexos.

## 🔧 Funcionalidades

Esta API oferece suporte completo às seguintes entidades e operações:

### 📚 Alunos
- Cadastro, listagem, atualização e remoção de alunos
- Vinculação com disciplinas
- Registro de presença e nota por disciplina
- Cálculo de média e percentual de presença
- Situação final do aluno (Aprovado/Reprovado)
- Envio de e-mail de boas-vindas no cadastro

### 🧑‍🏫 Professores
- Cadastro, listagem, atualização e exclusão
- Armazenamento seguro da senha
- Acesso a relatórios de desempenho de alunos
- Acesso autorizado às rotas protegidas para avaliação e presença

### 📘 Disciplinas
- Relação com alunos e professores
- Relatório de alunos reprovados por nota ou frequência

### 🏫 Cursos
- Cadastro e gerenciamento de cursos disponíveis
- Associação com turmas e disciplinas

### 👥 Turmas
- Associação entre cursos, professores e alunos
- Gestão de turmas vinculadas a disciplinas
- Visualização de turmas com seus respectivos vínculos

### ✅ Presenças
- Registro individual de presença por aluno/disciplina
- Cálculo do percentual de frequência
- Listagem de presença por aluno e disciplina

### 📝 Notas
- Registro de notas por aluno/disciplina
- Cálculo de média e verificação de aprovação
- Listagem detalhada de notas por aluno


### 📅 Eventos
- Cadastro e listagem de eventos
- Associação de participantes a eventos

### 👤 Participantes
- Gerenciamento de dados de participantes de eventos

### 🔐 Autenticação e Autorização
- Login com retorno de **token JWT**
- Middleware de autenticação para proteger rotas privadas
- Middleware de autorização para controle por tipo de usuário (`aluno` ou `professor`)
- Testes de segurança incluindo:
  - Login válido
  - Login inválido
  - Usuário inexistente
  - Falta de campos obrigatórios

### 🔍 Relatórios e Cálculos
- Alunos reprovados por nota ou frequência (`/disciplinas/:id/reprovados`)
- Situação individual do aluno (`/alunos/:id/situacao`)
- Médias e presenças por disciplina e por aluno
- Controle de acesso total aos relatórios pelo tipo de usuário

---

## 📱 Frontend em Flutter

Aplicação Flutter integrada à API com as seguintes funcionalidades:

- Tela de **login** com autenticação via JWT
- **Dashboard** com controle de acesso por tipo de usuário (aluno ou professor)
- Listagem estilizada e animada de alunos, professores e disciplinas
- Visualização de situação final do aluno
- Proteção de rotas, armazenamento de token e logout
- Interface visual moderna com **animações suaves** e tema baseado nas cores do **IFPR**

---

## 🎯 Como executar

1. Instale as dependências:
```bash
npm install
```

2. Configure o banco de dados no arquivo `.env`.

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run start-dev
```

---

## 🧪 Scripts disponíveis

```bash
npm install express sequelize mysql2 sequelize-typescript cors dotenv
npm install --save-dev typescript ts-node-dev @types/express @types/node
npm run start                # Inicia o servidor normalmente
npm run start-dev           # Inicia com nodemon e ts-node
npx jest --runInBand --detectOpenHandles        # Executa os testes
npx sequelize-cli db:seed:all --env development # Popula o banco com dados de exemplo
```

---

## 📦 Dependências

- **express** – Framework para criação de aplicações web
- **sequelize** – ORM para bancos relacionais
- **sequelize-typescript** – Integração entre Sequelize e TypeScript
- **mysql2** – Driver do MySQL
- **typescript** – Superset do JavaScript com tipagem
- **ts-node** – Executa arquivos TypeScript diretamente no Node.js
- **nodemon** – Reinicia o servidor automaticamente a cada alteração
- **dotenv** – Gerencia variáveis de ambiente
- **jsonwebtoken** – Utilizado para geração e validação de tokens JWT
- **bcryptjs** – Para criptografar senhas
- **nodemailer** – Envio de e-mails
- **jest** – Testes automatizados

---

## ❤️ Desenvolvimento

Atividade de Pair Programming com testes 100% funcionais. (Alan e Kemuly ❤)   
Desenvolvido com muito amor por: **Kemuly Lau** ❤
