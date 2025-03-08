📌 Monitoramento de Preços com AWS e Mercado Livre

📚 Visão Geral

Este projeto permite que os usuários marquem produtos que desejam comprar e definam um preço ideal. A ferramenta monitora os preços na API do Mercado Livre e, quando um produto atinge o valor desejado, um e-mail é enviado para o usuário.

A solução é construída utilizando AWS Lambda, SNS, DynamoDB, IAM e EventBridge, além do NestJS e da API do Mercado Livre.

🏷️ Tecnologias Utilizadas

- **NestJS** → Estrutura modular para a API backend.
- **AWS Lambda** → Funções serverless para execução assíncrona.
- **AWS SNS** → Envio de notificações e e-mails automáticos.
- **AWS DynamoDB** → Banco de dados NoSQL para armazenar produtos monitorados.
- **AWS EventBridge** → Agendamento da execução da Lambda para monitoramento.
- **AWS IAM** → Controle de permissões para os serviços AWS.
- **API Mercado Livre** → Busca de produtos e verificação de preços em tempo real.

🚀 Como Funciona

1. O usuário registra um produto e define um preço alvo.
2. A função AWS Lambda é acionada regularmente via AWS EventBridge.
3. A Lambda faz requisição à API do Mercado Livre para verificar os preços.
4. Se o preço do produto for igual ou menor ao definido pelo usuário:
   - O serviço AWS SNS envia um e-mail ao usuário notificando sobre a queda de preço.
5. O processo se repete continuamente.

🛠️ Como Configurar

**1️⃣ Configurar Credenciais**

Crie um arquivo dotenv e configure suas credenciais (você pode copiar e colar de env.example)

```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:12345678912:ProductsEmailSender
```

**2️⃣ Instalar Dependências**

Clone o repositório e instale as dependências do projeto:

```
git clone https://github.com/Vitor-742/aws-notificator.git
cd aws-notificator
npm install
```

**3️⃣ Executar o Servidor Localmente**

```
npm run start:dev
```

**4️⃣ Instale a extensão do VSCode REST Client**

```
npm run start:dev
```

**5️⃣ Sinta-se a vontade para seguir as requisições em my_requests.http**

🚀 Agora é só rodar e monitorar os preços automaticamente!
