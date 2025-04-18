FROM node:20-alpine as build

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Construir o aplicativo
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar arquivos de build para o nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configurar nginx para rotas do React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
