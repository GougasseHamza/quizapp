<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <h2>Reset Password</h2>
      <form @submit.prevent="handleResetPassword">
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
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-if="success" class="success-message">
          Password reset email sent! Please check your inbox.
        </div>
        <button type="submit" class="reset-btn" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
        <div class="links">
          <a @click="showLogin">Back to Login</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const success = ref(false)

const { loading, error } = authStore

const handleResetPassword = async () => {
  try {
    await authStore.resetPassword(email.value)
    success.value = true
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    // Error is handled by the store
  }
}

const showLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.forgot-password-box {
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

.success-message {
  color: #28a745;
  margin-bottom: 1rem;
  text-align: center;
}

.reset-btn {
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

.reset-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.reset-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.links {
  text-align: center;
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