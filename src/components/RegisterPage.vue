<template>
  <div>
    <h2>Регистрация</h2>
    <form @submit.prevent="register">
      <input v-model="userData.email" type="email" placeholder="Email" required>
      <input v-model="userData.password" type="password" placeholder="Пароль" required>
      <input v-model="userData.password_confirmation" type="password" placeholder="Подтверждение пароля" required>
      <button type="submit">Зарегистрироваться</button>
    </form>
    <!-- Отображение ошибок -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <!-- Отображение успешного сообщения -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const errorMessage = ref('')
const successMessage = ref('')

const userData = ref({
  email: '',
  password: '',
  password_confirmation: ''
})

const register = async () => {
  try {
    errorMessage.value = '' // Очищаем предыдущие ошибки
    successMessage.value = '' // Очищаем предыдущие сообщения об успехе

    await authStore.register(userData.value)
    successMessage.value = 'Регистрация успешна! Перенаправление на страницу входа...'

    // Задержка перед перенаправлением, чтобы пользователь увидел сообщение об успехе
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    if (error.response) {
      // Получаем сообщение об ошибке от сервера
      if (error.response.data.detail) {
        errorMessage.value = error.response.data.detail
      } else if (typeof error.response.data === 'object') {
        // Если ошибки приходят в виде объекта
        errorMessage.value = Object.values(error.response.data).flat().join(', ')
      } else {
        errorMessage.value = 'Произошла ошибка при регистрации'
      }
    } else {
      errorMessage.value = 'Ошибка соединения с сервером'
    }
    console.error('Ошибка регистрации:', error)
  }
}
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid red;
  border-radius: 4px;
  background-color: #ffebee;
}

.success-message {
  color: green;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid green;
  border-radius: 4px;
  background-color: #e8f5e9;
}
</style>
