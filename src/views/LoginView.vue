<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="Enter your email"
            :disabled="loading"
          >
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Enter your password"
            :disabled="loading"
          >
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <div class="links">
          <a @click="showRegister">Create an account</a>
          <a @click="showForgotPassword">Forgot password?</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { auth } from '../firebase/config'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')

const { loading } = authStore

const handleLogin = async () => {
  try {
    console.log('Attempting login with:', email.value)
    const userCredential = await authStore.login(email.value, password.value)
    console.log('Login successful:', userCredential)
    router.replace('/')
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.message || 'Failed to login. Please try again.'
  }
}

const showRegister = () => {
  router.replace('/register')
}

const showForgotPassword = () => {
  router.replace('/forgot-password')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.login-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.login-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.links {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.links a {
  color: #4CAF50;
  text-decoration: none;
  cursor: pointer;
}

.links a:hover {
  text-decoration: underline;
}
</style> 