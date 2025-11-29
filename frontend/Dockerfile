# Используем Node.js для установки зависимостей и запуска live-server
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы фронтенда
COPY . .

# Открываем порт для live-server
EXPOSE 3000

# Запускаем live-server на порту 3000
CMD ["npm", "run", "dev"]

