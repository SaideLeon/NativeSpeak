# Usa Node como base
FROM node:20-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Faz o build do projeto
RUN npm run build

# Expõe a porta 3001
EXPOSE 3001

# Executa o Vite preview na porta 3001
CMD ["npm", "run", "preview", "--", "--port", "3001"]
