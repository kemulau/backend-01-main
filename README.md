# 📦 Dependências do Projeto

Este projeto utiliza algumas bibliotecas essenciais para seu funcionamento. Abaixo, você encontrará uma breve explicação sobre cada dependência e seu papel no sistema.

## 🚀 Principais Dependências

### 🛡️ cors
**Descrição**: Middleware para habilitar o CORS (Cross-Origin Resource Sharing), permitindo que o servidor aceite requisições de diferentes origens.  

**Uso**: Necessário quando a API precisa ser acessada de domínios diferentes, como em aplicações frontend separadas do backend.

---

### 🔐 dotenv
**Descrição**: Biblioteca que carrega variáveis de ambiente a partir de um arquivo `.env`.  

**Uso**: Permite armazenar credenciais sensíveis, como chaves de API e configurações do banco de dados, sem expô-las diretamente no código.

---

### ⚡ express
**Descrição**: Framework minimalista e flexível para construir servidores e APIs em Node.js.  

**Uso**: Facilita a criação de rotas, middlewares e manipulação de requisições HTTP, tornando o desenvolvimento mais rápido e organizado.

---

### 🔄 nodemon
**Descrição**: Ferramenta que monitora arquivos do projeto e reinicia automaticamente o servidor ao detectar alterações no código.  

**Uso**: Muito útil durante o desenvolvimento, pois evita a necessidade de reiniciar manualmente o servidor a cada alteração no código.

---

### 💡 typescript
**Descrição**: Superset do JavaScript que adiciona tipagem estática e novos recursos para desenvolvimento.  

**Uso**: Melhora a segurança do código, evita erros de tipagem e facilita a manutenção do projeto.

---

💡 **Dica:** Para instalar todas as dependências de uma vez, use o comando:

```sh
npm install cors dotenv express nodemon typescript
