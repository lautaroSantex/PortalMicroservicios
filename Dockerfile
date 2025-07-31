# --- ETAPA 1: Builder ---
# Usamos una imagen de Node para construir el proyecto Angular
FROM node:18-alpine AS builder

WORKDIR /app

# Copiamos los manifiestos de dependencias para aprovechar el caché
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos todo el código fuente del proyecto
COPY . .

# Construimos la aplicación para producción. La salida estará en /app/dist/microservices-portal
# Usamos el comando de tu package.json
RUN npm run build -- --configuration production

# --- ETAPA 2: Runner ---
# Usamos una imagen oficial y ligera de Nginx para servir los archivos
FROM nginx:stable-alpine

# Copiamos la configuración personalizada de Nginx que creamos
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos estáticos generados desde la etapa 'builder'
# La ruta /app/dist/microservices-portal viene de tu archivo angular.json (outputPath)
COPY --from=builder /app/dist/microservices-portal /usr/share/nginx/html

# Exponemos el puerto 80, que es el puerto por defecto de Nginx
EXPOSE 80

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]