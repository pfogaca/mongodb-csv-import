# RESTful API Import MongoDB

API para importar arquivos .csv para MongoDB, desenvolvida em Node.js.

Requisitos de servidor:
  - Node.js >= 11.0
  - MongoDB >= 4.0
  - NPM >= 6.0

# Instalação

```sh
$ npm i
$ npm i nodemon -g
$ nodemon server.js
```

Edite o arquivo .env na raiz do projeto para inserir as variáveis de ambiente.

Inserir arquivo .csv na raiz do projeto e chamar a rota /api/update para atualizar o banco.