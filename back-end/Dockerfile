# Etapa 1: Build
FROM node:20-alpine AS builder

# Habilitar corepack (incluye pnpm)
RUN corepack enable

WORKDIR /app

# Copiamos solo archivos necesarios para instalar dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Build
RUN pnpm run build


# Etapa 2: Producción
FROM node:20-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Solo dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Copiar código compilado
COPY --from=builder /app/dist ./dist

# Crear carpeta uploads
RUN mkdir -p uploads

EXPOSE 3000

CMD ["node", "dist/main.js"]