import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api/accounts/'  // обновленный базовый URL
});

// Перехватчик для добавления токена к каждому запросу
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехватчик для обработки ошибок и обновления токена
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Пытаемся обновить токен
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('http://localhost:8000/api/accounts/token/refresh/', {
          refresh: refreshToken
        });

        // Сохраняем новый токен
        localStorage.setItem('access_token', response.data.access);

        // Повторяем исходный запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Если не удалось обновить токен, разлогиниваем пользователя
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
