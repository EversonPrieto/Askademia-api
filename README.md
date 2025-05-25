# Monitoria Askademia - Links Principais

- [Documentação](https://gitlab.com/senac-projetos-de-desenvolvimento/2025-verson-prieto-e-victor-andrei/wiki/-/wikis/home)
- [APP](https://gitlab.com/senac-projetos-de-desenvolvimento/2025-verson-prieto-e-victor-andrei/web)
- [API](https://gitlab.com/senac-projetos-de-desenvolvimento/2025-verson-prieto-e-victor-andrei/api)
- [Miro](https://miro.com/app/board/uXjVIG8f3GE=/)
- [Figma](https://www.figma.com/design/kzwRaLBFXPHg7TIWlY1c3r/Monitoria-Askademia?node-id=0-1&p=f&t=7KB3vIHrZXHVciNC-0)

## Discentes:
- Éverson Lemos Prieto
- Victor Andrei

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
