<template>
  <nav class="navbar">
    <div class="nav-brand">
      <router-link to="/">Quiz App</router-link>
    </div>
    <div class="nav-links">
      <template v-if="isAuthenticated">
        <router-link to="/">Home</router-link>
        <router-link to="/leaderboard">Leaderboard</router-link>
        <router-link to="/profile">Profile</router-link>
        <router-link to="/admin" v-if="isAdmin">Admin</router-link>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </template>
      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = ref(false) // TODO: Replace with actual auth state
const isAdmin = ref(false) // TODO: Replace with actual admin state

const handleLogout = () => {
  // TODO: Implement actual logout logic
  isAuthenticated.value = false
  isAdmin.value = false
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand a {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-links a:hover {
  background-color: var(--background-color);
}

.nav-links a.router-link-active {
  color: var(--primary-color);
  font-weight: bold;
}

.logout-button {
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-button:hover {
  background-color: #dc3545;
  color: white;
}
</style> 