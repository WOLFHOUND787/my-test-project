<template>
  <div>
    <h2>Профиль</h2>
    <div v-if="profile" class="profile-container">
      <!-- Основная информация -->
      <div class="basic-info">
        <p>Email: {{ profile.email }}</p>
      </div>

      <!-- Вкладки для переключения между типами профиля -->
      <div class="profile-tabs">
        <button
          :class="{ active: activeTab === 'physical' }"
          @click="activeTab = 'physical'"
        >
          Физическое лицо
        </button>
        <button
          :class="{ active: activeTab === 'legal' }"
          @click="activeTab = 'legal'"
        >
          Юридическое лицо
        </button>
      </div>

      <!-- Контент физического лица -->
      <div v-if="activeTab === 'physical' && profile.physical_profile" class="profile-content">
        <h3>Данные физического лица</h3>
        <div class="profile-details">
          <p><strong>Имя:</strong> {{ profile.physical_profile.first_name }}</p>
          <p><strong>Фамилия:</strong> {{ profile.physical_profile.last_name }}</p>
          <p><strong>Отчество:</strong> {{ profile.physical_profile.middle_name }}</p>
          <p><strong>ИИН:</strong> {{ profile.physical_profile.iin }}</p>
          <p><strong>Специальность:</strong> {{ profile.physical_profile.specialty?.name }}</p>
          <p><strong>Образование:</strong> {{ profile.physical_profile.education?.name }}</p>
          <p><strong>Опыт работы:</strong> {{ profile.physical_profile.experience?.name }}</p>
          <div class="programs">
            <strong>Программы:</strong>
            <ul>
              <li v-for="program in profile.physical_profile.programs" :key="program.id">
                {{ program.name }}
              </li>
            </ul>
          </div>
          <div class="photo" v-if="profile.physical_profile.photo">
            <img :src="profile.physical_profile.photo" alt="Фото профиля">
          </div>
        </div>
      </div>

      <!-- Контент юридического лица -->
      <div v-if="activeTab === 'legal' && profile.legal_profile" class="profile-content">
        <h3>Данные юридического лица</h3>
        <div class="profile-details">
          <p><strong>Название компании:</strong> {{ profile.legal_profile.company_name }}</p>
          <p><strong>Форма юр. лица:</strong> {{ profile.legal_profile.legal_entity_type?.name }}</p>
          <p><strong>Категория:</strong> {{ profile.legal_profile.category?.name }}</p>
          <p><strong>Проект:</strong> {{ profile.legal_profile.project }}</p>

          <!-- Документы -->
          <div class="documents">
            <h4>Документы:</h4>
            <p v-if="profile.legal_profile.license">
              <a :href="profile.legal_profile.license" target="_blank">Лицензия</a>
            </p>
            <p v-if="profile.legal_profile.accreditation">
              <a :href="profile.legal_profile.accreditation" target="_blank">Аккредитация</a>
            </p>
            <p v-if="profile.legal_profile.portfolio">
              <a :href="profile.legal_profile.portfolio" target="_blank">Портфолио работ</a>
            </p>
            <p v-if="profile.legal_profile.completion_acts">
              <a :href="profile.legal_profile.completion_acts" target="_blank">Акты выполненных работ</a>
            </p>
            <p v-if="profile.legal_profile.expertise_confirmation">
              <a :href="profile.legal_profile.expertise_confirmation" target="_blank">Подтверждение экспертизы</a>
            </p>
          </div>

          <div class="photo" v-if="profile.legal_profile.photo">
            <img :src="profile.legal_profile.photo" alt="Фото организации">
          </div>
        </div>
      </div>

      <router-link to="/profile/edit" class="edit-button">Редактировать профиль</router-link>
    </div>

    <!-- Отображение ошибок -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <button @click="logout" class="logout-button">Выйти</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const profile = ref(null)
const errorMessage = ref('')
const activeTab = ref('physical')

onMounted(async () => {
  try {
    errorMessage.value = ''
    profile.value = await authStore.getProfile()
    // Устанавливаем активную вкладку в зависимости от типа профиля
    activeTab.value = profile.value.profile_type || 'physical'
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
    if (error.response) {
      errorMessage.value = error.response.data.detail || 'Ошибка загрузки профиля'
    } else {
      errorMessage.value = 'Ошибка соединения с сервером'
    }
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
})

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    errorMessage.value = 'Ошибка при выходе из системы'
    console.error('Ошибка при выходе:', error)
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-tabs {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.profile-tabs button {
  padding: 10px 20px;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  border-radius: 4px;
}

.profile-tabs button.active {
  background: #42b983;
  color: white;
}

.profile-content {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-details {
  display: grid;
  gap: 15px;
}

.documents {
  margin-top: 20px;
}

.documents a {
  color: #42b983;
  text-decoration: none;
}

.photo img {
  max-width: 200px;
  border-radius: 4px;
}

.edit-button {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.logout-button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: red;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid red;
  border-radius: 4px;
  background-color: #ffebee;
}
</style>
