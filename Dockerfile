FROM node:18-alpine

WORKDIR /app

# Instalar dependencias para compilar módulos nativos
RUN apk add --no-cache python3 make g++

# Copiar solo los archivos de dependencias primero para aprovechar el caché
COPY package*.json ./

# Instalar dependencias con flag para resolver conflictos
RUN npm install --legacy-peer-deps

# Copiar el resto de la aplicación
COPY . .

# Limpiar caché de npm para reducir el tamaño de la imagen
RUN npm cache clean --force

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Iniciar la aplicación
CMD ["npm", "start"]
