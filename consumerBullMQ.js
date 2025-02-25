const { Worker } = require("bullmq");
const redisOptions = {
  host: "localhost",
  port: 6379,
};

const worker = new Worker(
  "orderQueue",
  async (job) => {
    // Processar o pedido aqui
    console.log("Processando pedido do BullMQ:", job.name, job.data);
  },
  { redis: redisOptions }
);

worker.on("completed", (job) => {
  console.log(`Pedido processado: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`Falha no processamento do pedido: ${job.id}`, err);
});
