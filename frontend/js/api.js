import axios from 'axios';

// Создание экземпляра axios с базовыми настройками

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});
