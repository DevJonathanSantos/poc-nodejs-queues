# Use a imagem oficial do Node.js
FROM node:16

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos para dentro do container
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código da aplicação
COPY . .

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para rodar o servidor
CMD [ "node", "server.js" ]
