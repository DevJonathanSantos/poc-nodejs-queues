import express from "express";
import { createServer } from "http";
import { Queue, Worker, Job, QueueEvents } from "bullmq";
import { randomUUID } from "crypto";

const app = express();
const port = 3000;

const queue = new Queue("ORDER_QUEUE", {
  connection: { host: "localhost", port: 6379 },
});
const queueEvents = new QueueEvents("ORDER_QUEUE", {
  connection: { host: "localhost", port: 6379 },
});

app.use(express.json());

app.post("/order", async (req, res) => {
  try {
    const pedido = req.body;
    const jobId = randomUUID();

    const job = await queue.add("novoPedido", pedido, { jobId });

    // Aguarda a finalização do job e retorna o resultado na resposta HTTP
    const result = await job.waitUntilFinished(queueEvents);

    res.json({ success: true, jobId, result });
  } catch (error) {
    console.error("Erro ao processar pedido:", error);
    res.status(500).json({ success: false, message: "Erro no processamento" });
  }
});

// Worker que processa os pedidos
const worker = new Worker(
  "ORDER_QUEUE",
  async (job: Job) => {
    console.log("Processando pedido:", job.data);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulando tempo de processamento
    return { status: "Pedido processado com sucesso", pedido: job.data };
  },
  { connection: { host: "localhost", port: 6379 } }
);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
