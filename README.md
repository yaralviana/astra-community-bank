# {Astra}CommunityBank

## Como testar

Clone o repositório:

```sh
git clone https://github.com/yaralviana/astra-community-bank
```

Entre na pasta do projeto:

```sh
cd astra-community-bank
```

### Executar o projeto

- Instalação das dependências:

```sh
npm i
```

- Execução

```sh
npm run start:dev
```

## Rotas para Gerenciamento de Gerentes

- `GET` http://localhost:3000/managers

  - **Descrição:** Obtém todos os gerentes.

- `GET` http://localhost:3000/managers/:id

  - **Descrição:** Obtém um gerente pelo ID.

- `POST` http://localhost:3000/managers

  - **Descrição:** Cria um novo gerente.
  - **Corpo da requisição:**
    ```json
    {
      "fullName": "Lzzy Hale"
    }
    ```

- `PUT` http://localhost:3000/managers/:id

  - **Descrição:** Atualiza os detalhes de um gerente existente pelo ID.
  - **Corpo da requisição:**
    ```json
    {
      "fullName": "Lzzy Hale Hyde"
    }
    ```

- `DELETE` http://localhost:3000/managers/:id
  - **Descrição:** Exclui um gerente pelo ID.

## Rotas para Gerenciamento de Clientes sob um Gerente

- `POST` http://localhost:3000/managers/:managerId/customers

  - **Descrição:** Adiciona um cliente sob a responsabilidade de um gerente.
  - **Corpo da requisição:**

    ```json
    {
      "fullName": "Alice no País das Maravilhas",
      "address": "Rua das pedras bem brilhantes, nº 0",
      "phone": "27999999999"
    }
    ```

- `DELETE` http://localhost:3000/managers/:managerId/customers/:customerId

  - **Descrição:** Remove um cliente da responsabilidade de um gerente pelo ID do cliente.

- `GET` http://localhost:3000/managers/:managerId/customers
  - **Descrição:** Obtém todos os clientes sob a responsabilidade de um gerente.

## Rotas para Gerenciamento de Contas de um Cliente sob um Gerente

- `POST` http://localhost:3000/managers/:managerId/customers/:customerId/accounts

  - **Descrição:** Abre uma conta para um cliente sob a responsabilidade de um gerente.
  - **Corpo da requisição:**
    ```json
    {
      "type": "savings",
      "extra": 1000
    }
    ```

- `DELETE` http://localhost:3000/managers/:managerId/customers/:customerId/accounts/:accountType

  - **Descrição:** Fecha uma conta de um cliente sob a responsabilidade de um gerente pelo tipo de conta.

- `PUT` http://localhost:3000/managers/:managerId/customers/:customerId/accounts/:accountType

  - **Descrição:** Modifica o tipo de uma conta de um cliente sob a responsabilidade de um gerente.
  - **Corpo da requisição:**
    ```json
    {
      "newType": "checking"
    }
    ```

- `GET` http://localhost:3000/managers/:managerId/customers/:customerId/accounts
  - **Descrição:** Obtém todas as contas de um cliente sob a responsabilidade de um gerente.

## Testes de Rotas para Processamento de Pagamentos

- `POST` http://localhost:3000/accounts/:customerId/:type/pay
  - **Descrição:** Requisição para efetuar pagamento. No exemplo abaixo é utilizado o pagamento via PIX.
  - **Corpo da requisição:**
    ```json
    {
      "amount": 100.0,
      "paymentType": "PIX",
      "paymentDetail": "abc123pixkey"
    }
    ```

Críticas e sugestões são muito bem-vindas. 💜
