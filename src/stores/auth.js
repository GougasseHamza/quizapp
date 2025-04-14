import { defineStore } from 'pinia'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Initialize auth state listener
  onAuthStateChanged(auth, (currentUser) => {
    console.log('Auth state changed:', currentUser)
    user.value = currentUser
  })

  // Register new user
  const register = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      console.log('Attempting registration with:', email)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log('Registration successful:', userCredential)
      return userCredential.user
    } catch (err) {
      console.error('Registration error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Login user
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      console.log('Attempting login with:', email)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('Login successful:', userCredential)
      return userCredential.user
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout user
  const logout = async () => {
    loading.value = true
    error.value = null
    try {
      console.log('Attempting logout')
      await signOut(auth)
      console.log('Logout successful')
    } catch (err) {
      console.error('Logout error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    loading.value = true
    error.value = null
    try {
      console.log('Attempting password reset for:', email)
      await sendPasswordResetEmail(auth, email)
      console.log('Password reset email sent')
    } catch (err) {
      console.error('Password reset error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    resetPassword
  }
}) 