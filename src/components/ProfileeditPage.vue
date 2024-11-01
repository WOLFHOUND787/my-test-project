<template>
  <div class="profile-edit">
    <h2>Редактирование профиля</h2>
    <div class="profile-type-toggle">
      <button
        :class="{ active: profileData.profile_type === 'physical' }"
        @click="setProfileType('physical')"
      >
        Физическое лицо
      </button>
      <button
        :class="{ active: profileData.profile_type === 'legal' }"
        @click="setProfileType('legal')"
      >
        Юридическое лицо
      </button>
    </div>

    <form @submit.prevent="updateProfile">
      <!-- Общие поля -->
      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" v-model="profileData.email" type="email" required>
      </div>

      <!-- Поля для физического лица -->
      <div v-if="profileData.profile_type === 'physical'">
        <div class="form-group">
          <label for="first_name">Имя:</label>
          <input id="first_name" v-model="profileData.physical_profile.first_name" type="text" required>
        </div>
        <div class="form-group">
          <label for="last_name">Фамилия:</label>
          <input id="last_name" v-model="profileData.physical_profile.last_name" type="text" required>
        </div>
        <div class="form-group">
          <label for="middle_name">Отчество:</label>
          <input id="middle_name" v-model="profileData.physical_profile.middle_name" type="text">
        </div>
        <div class="form-group">
          <label for="iin">ИИН:</label>
          <input id="iin" v-model="profileData.physical_profile.iin" type="text" maxlength="12">
        </div>
        <div class="form-group">
          <label for="specialty">Специальность:</label>
          <select id="specialty" v-model="profileData.physical_profile.specialty">
            <option v-for="specialty in specialties" :key="specialty.id" :value="specialty.id">
              {{ specialty.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="education">Образование:</label>
          <select id="education" v-model="profileData.physical_profile.education">
            <option v-for="education in educations" :key="education.id" :value="education.id">
              {{ education.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="experience">Опыт работы:</label>
          <select id="experience" v-model="profileData.physical_profile.experience">
            <option v-for="experience in experiences" :key="experience.id" :value="experience.id">
              {{ experience.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Программы:</label>
          <div v-for="program in programs" :key="program.id">
            <input
              type="checkbox"
              :id="'program-' + program.id"
              :value="program.id"
              v-model="profileData.physical_profile.programs"
            >
            <label :for="'program-' + program.id">{{ program.name }}</label>
          </div>
        </div>
        <div class="form-group">
          <label for="photo">Фото:</label>
          <input id="photo" type="file" @change="handlePhotoUpload">
        </div>
      </div>

      <!-- Поля для юридического лица -->
      <div v-if="profileData.profile_type === 'legal'">
        <div class="form-group">
          <label for="company_name">Название компании:</label>
          <input id="company_name" v-model="profileData.legal_profile.company_name" type="text" required>
        </div>
        <div class="form-group">
          <label for="legal_entity_type">Форма юридического лица:</label>
          <select id="legal_entity_type" v-model="profileData.legal_profile.legal_entity_type">
            <option v-for="type in legalEntityTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="category">Категория:</label>
          <select id="category" v-model="profileData.legal_profile.category">
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="project">Проект:</label>
          <textarea id="project" v-model="profileData.legal_profile.project"></textarea>
        </div>
        <div class="form-group">
          <label for="license">Лицензия:</label>
          <input id="license" type="file" @change="handleFileUpload('license')">
        </div>
        <div class="form-group">
          <label for="accreditation">Аккредитация:</label>
          <input id="accreditation" type="file" @change="handleFileUpload('accreditation')">
        </div>
        <div class="form-group">
          <label for="portfolio">Портфолио работ:</label>
          <input id="portfolio" type="file" @change="handleFileUpload('portfolio')">
        </div>
        <div class="form-group">
          <label for="completion_acts">Акты выполненных работ:</label>
          <input id="completion_acts" type="file" @change="handleFileUpload('completion_acts')">
        </div>
        <div class="form-group">
          <label for="expertise_confirmation">Подтверждение экспертизы:</label>
          <input id="expertise_confirmation" type="file" @change="handleFileUpload('expertise_confirmation')">
        </div>
        <div class="form-group">
          <label for="legal_photo">Фото организации:</label>
          <input id="legal_photo" type="file" @change="handlePhotoUpload">
        </div>
      </div>

      <button type="submit" class="submit-button">Сохранить изменения</button>
    </form>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/services/api'  // Добавьте этот импорт

const authStore = useAuthStore()
const router = useRouter()
const profileData = ref({
  email: '',
  profile_type: 'physical',
  physical_profile: {
    first_name: '',
    last_name: '',
    middle_name: '',
    iin: '',
    specialty: null,
    education: null,
    experience: null,
    programs: [],
    photo: null
  },
  legal_profile: {
    company_name: '',
    legal_entity_type: null,
    category: null,
    project: '',
    license: null,
    accreditation: null,
    portfolio: null,
    completion_acts: null,
    expertise_confirmation: null,
    photo: null
  }
})

const errorMessage = ref('')
const specialties = ref([])
const educations = ref([])
const experiences = ref([])
const programs = ref([])
const legalEntityTypes = ref([])
const categories = ref([])

// Загрузка справочных данных
const loadReferenceData = async () => {
  try {
    // Здесь должны быть API-запросы для получения справочных данных
    const [
      specialtiesRes,
      educationsRes,
      experiencesRes,
      programsRes,
      legalTypesRes,
      categoriesRes
    ] = await Promise.all([
      api.get('specialties/'),
      api.get('educations/'),
      api.get('experiences/'),
      api.get('programs/'),
      api.get('legal-entity-types/'),
      api.get('categories/')
    ])

    console.log('Specialties:', specialtiesRes.data)
    console.log('Educations:', educationsRes.data)
    console.log('Experiences:', experiencesRes.data)
    console.log('Programs:', programsRes.data)
    console.log('Legal Entity Types:', legalTypesRes.data)
    console.log('Categories:', categoriesRes.data)

    specialties.value = specialtiesRes.data
    educations.value = educationsRes.data
    experiences.value = experiencesRes.data
    programs.value = programsRes.data
    legalEntityTypes.value = legalTypesRes.data
    categories.value = categoriesRes.data
  } catch (error) {
    console.error('Ошибка загрузки справочных данных:', error)
    errorMessage.value = 'Ошибка загрузки справочных данных'
  }
}

onMounted(async () => {
  try {
    // Загружаем текущий профиль
    const currentProfile = await authStore.getProfile()
    profileData.value = {
      ...currentProfile,
      physical_profile: currentProfile.physical_profile || {},
      legal_profile: currentProfile.legal_profile || {}
    }
    // Загружаем справочные данные
    await loadReferenceData()
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
    errorMessage.value = 'Ошибка загрузки профиля'
  }
})

const setProfileType = (type) => {
  profileData.value.profile_type = type
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (profileData.value.profile_type === 'physical') {
      profileData.value.physical_profile.photo = file
    } else {
      profileData.value.legal_profile.photo = file
    }
  }
}

const handleFileUpload = (fieldName) => (event) => {
  const file = event.target.files[0]
  if (file) {
    profileData.value.legal_profile[fieldName] = file
  }
}

const updateProfile = async () => {
  try {
    const formData = new FormData()

    // Добавляем основные данные
    formData.append('email', profileData.value.email)
    formData.append('profile_type', profileData.value.profile_type)

    // Добавляем данные в зависимости от типа профиля
    if (profileData.value.profile_type === 'physical') {
      Object.keys(profileData.value.physical_profile).forEach(key => {
        if (key === 'programs') {
          profileData.value.physical_profile[key].forEach(programId => {
            formData.append('programs', programId)
          })
        } else if (key === 'photo' && profileData.value.physical_profile[key] instanceof File) {
          formData.append('photo', profileData.value.physical_profile[key])
        } else {
          formData.append(key, profileData.value.physical_profile[key])
        }
      })
    } else {
      Object.keys(profileData.value.legal_profile).forEach(key => {
        if (profileData.value.legal_profile[key] instanceof File) {
          formData.append(key, profileData.value.legal_profile[key])
        } else {
          formData.append(key, profileData.value.legal_profile[key])
        }
      })
    }

    await authStore.updateProfile(formData)
    router.push('/profile')
  } catch (error) {
    console.error('Ошибка обновления профиля:', error)
    errorMessage.value = 'Ошибка обновления профиля'
  }
}
</script>

<style scoped>
.profile-edit {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-type-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.profile-type-toggle button {
  padding: 10px 20px;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  border-radius: 4px;
}

.profile-type-toggle button.active {
  background: #42b983;
  color: white;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  min-height: 100px;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
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
