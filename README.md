## `npm install`
Instala todas as dependências necessárias para o projeto.

## `.env`
Crie um arquivo .env na raiz do seu projeto e adicione as seguintes variáveis de ambiente para configuração do banco de dados:

```bash
### Configuração do banco de dados para o Prisma (exemplo com dados fictícios).
DATABASE_URL="postgresql://usuario:senha@endereco:porta/nome_do_banco?sslmode=require"
```

## `npx prisma generate`
Gera o cliente do Prisma com base no schema definido no arquivo schema.prisma.
Esse comando cria as tipagens e funções para facilitar a interação com o banco de dados.

## `npx prisma migrate dev --name init`
Aplica as migrações do banco de dados no ambiente de desenvolvimento.
A migração será nomeada como init, representando geralmente a configuração inicial.
Esse comando cria as tabelas conforme definidas no schema do Prisma.

## `npm run dev`
Inicia a aplicação em modo de desenvolvimento.
Abra [http://localhost:3004](http://localhost:3004) para visualizá-la no navegador.

A aplicação será recarregada automaticamente sempre que você fizer alterações no código.
