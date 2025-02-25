const AWS = require("aws-sdk");
const sqs = new AWS.SQS({ region: "us-east-1" });
const SQS_QUEUE_URL =
  "http://host.docker.internal:4566/000000000000/your-queue";

const processSQSMessages = () => {
  const params = {
    QueueUrl: SQS_QUEUE_URL,
    MaxNumberOfMessages: 10, // Número máximo de mensagens a serem recebidas por vez
    WaitTimeSeconds: 20, // Long Polling
  };

  sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.error("Erro ao receber mensagens do SQS:", err);
      return;
    }

    if (data.Messages) {
      data.Messages.forEach(async (message) => {
        console.log("Processando pedido do SQS:", JSON.parse(message.Body));

        // Processar o pedido aqui

        const deleteParams = {
          QueueUrl: SQS_QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle,
        };

        sqs.deleteMessage(deleteParams, (err) => {
          if (err) {
            console.error("Erro ao excluir a mensagem do SQS:", err);
          } else {
            console.log("Mensagem excluída com sucesso");
          }
        });
      });
    } else {
      console.log("Nenhuma mensagem encontrada");
    }

    // Chama novamente para continuar ouvindo a fila
    processSQSMessages();
  });
};

processSQSMessages();
