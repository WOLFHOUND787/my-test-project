import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: !!localStorage.getItem('access_token'),
  }),

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('login/', credentials)
        localStorage.setItem('access_token', response.data.access)
        localStorage.setItem('refresh_token', response.data.refresh)
        this.isAuthenticated = true
        await this.getProfile()  // Получаем профиль сразу после логина
        return response
      } catch (error) {
        throw error
      }
    },

    async register(userData) {
      try {
        const response = await api.post('register/', userData)
        return response
      } catch (error) {
        throw error
      }
    },

    async logout() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      this.isAuthenticated = false
      this.user = null
    },

    async getProfile() {
      try {
        const response = await api.get('profile/')
        this.user = response.data
        return response.data
      } catch (error) {
        throw error
      }
    },

    async updateProfile(profileData) {
      try {
        const response = await api.put('profile/edit/', profileData)
        this.user = response.data
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
})
