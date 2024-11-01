<template>
  <div>
    <h2>Вход</h2>
    <form @submit.prevent="login">
      <input v-model="credentials.email" type="email" placeholder="Email" required>
      <input v-model="credentials.password" type="password" placeholder="Пароль" required>
      <button type="submit">Войти</button>
    </form>
    <!-- Отображение ошибок -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
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

const credentials = ref({
  email: '',
  password: ''
})

const login = async () => {
  try {
    errorMessage.value = '' // Очищаем предыдущие ошибки
    await authStore.login(credentials.value)
    // Очищаем форму
    credentials.value = {
      email: '',
      password: ''
    }
    router.push('/profile')
  } catch (error) {
    if (error.response) {
      // Получаем сообщение об ошибке от сервера
      if (error.response.data.detail) {
        errorMessage.value = error.response.data.detail
      } else if (typeof error.response.data === 'object') {
        // Если ошибки приходят в виде объекта
        errorMessage.value = Object.values(error.response.data).flat().join(', ')
      } else {
        errorMessage.value = 'Произошла ошибка при входе'
      }
    } else {
      errorMessage.value = 'Ошибка соединения с сервером'
    }
    console.error('Ошибка входа:', error)
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
</style>
