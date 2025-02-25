const express = require("express");
const { Queue } = require("bullmq");
const AWS = require("aws-sdk");

const app = express();
app.use(express.json());

const redisOptions = {
  host: "localhost", // Se estiver rodando no Docker, use o nome do serviço Redis.
  port: 6379,
};

const sqs = new AWS.SQS({ region: "us-east-1" });

// BullMQ - Configuração de Fila
const orderQueue = new Queue("orderQueue", { redis: redisOptions });

// SQS - Configuração de Fila
const SQS_QUEUE_URL =
  "http://host.docker.internal:4566/000000000000/your-queue"; // Localstack URL

app.post("/order/bullmq", async (req, res) => {
  const order = req.body;
  await orderQueue.add("createOrder", order);
  res.status(200).send({ message: "Pedido enviado para BullMQ" });
});

app.post("/order/sqs", async (req, res) => {
  const order = req.body;
  const params = {
    QueueUrl: SQS_QUEUE_URL,
    MessageBody: JSON.stringify(order),
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Erro ao enviar para o SQS", error: err });
    }
    res.status(200).send({ message: "Pedido enviado para o SQS", data });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
