# Imagem base
FROM node:latest

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código
COPY . .

# Expor a porta da API
EXPOSE 3000

# Comando para rodar a API
CMD ["node", "server.js"]
