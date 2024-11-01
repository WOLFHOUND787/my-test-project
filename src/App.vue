<template>
  <div id="app">
    <nav>
      <router-link to="/">Главная</router-link> |
      <template v-if="!authStore.isAuthenticated">
        <router-link to="/login">Войти</router-link> |
        <router-link to="/register">Регистрация</router-link>
      </template>
      <template v-if="authStore.isAuthenticated">
        <router-link to="/profile">Профиль</router-link>
      </template>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
