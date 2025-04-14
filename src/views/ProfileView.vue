<template>
  <div class="profile">
    <div class="profile-header">
      <div class="avatar">
        <img :src="user.photoURL || 'https://via.placeholder.com/150'" alt="User avatar">
      </div>
      <div class="user-info">
        <h2>{{ user.displayName || 'Anonymous User' }}</h2>
        <p class="email">{{ user.email }}</p>
        <div class="stats">
          <div class="stat">
            <span class="stat-value">{{ userStats.totalQuizzes || 0 }}</span>
            <span class="stat-label">Quizzes Taken</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ userStats.averageScore || 0 }}%</span>
            <span class="stat-label">Average Score</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ userStats.lastQuizAttempt ? formatDate(userStats.lastQuizAttempt) : 'Never' }}</span>
            <span class="stat-label">Last Quiz</span>
          </div>
        </div>
      </div>
    </div>

    <div class="quiz-history">
      <h3>Quiz History</h3>
      <div v-if="loading" class="loading">
        Loading quiz history...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else-if="quizHistory.length === 0" class="no-history">
        No quiz history available
      </div>
      <div v-else class="history-grid">
        <div class="history-header">
          <div>Quiz</div>
          <div>Category</div>
          <div>Difficulty</div>
          <div>Score</div>
          <div>Date</div>
          <div>Time</div>
        </div>
        
        <div v-for="attempt in quizHistory" :key="attempt.id" class="history-row">
          <div class="quiz-title">{{ attempt.quizTitle }}</div>
          <div class="category">{{ attempt.quizCategory }}</div>
          <div class="difficulty">{{ attempt.quizDifficulty }}</div>
          <div class="score">{{ attempt.score }}/{{ attempt.totalQuestions }}</div>
          <div class="date">{{ formatDate(attempt.date) }}</div>
          <div class="time">{{ formatTime(attempt.timeTaken) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuizStore } from '../stores/quiz'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useRoute } from 'vue-router'

const quizStore = useQuizStore()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const route = useRoute()

const quizHistory = ref([])
const loading = ref(true)
const error = ref(null)
const userStats = ref({ 
  totalQuizzes: 0, 
  averageScore: 0,
  lastQuizAttempt: null
})

const formatDate = (date) => {
  if (!date) return 'Never'
  const d = new Date(date.seconds * 1000)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

const fetchUserStats = async (userId) => {
  try {
    const userStatsRef = doc(db, 'userStats', userId)
    const userStatsDoc = await getDoc(userStatsRef)
    
    if (userStatsDoc.exists()) {
      userStats.value = userStatsDoc.data()
    }
  } catch (err) {
    console.error('Error fetching user stats:', err)
    error.value = 'Failed to load user statistics'
  }
}

// Watch for route changes to refresh data
watch(() => route.path, async () => {
  if (route.path === '/profile') {
    await refreshData()
  }
}, { immediate: true })

const refreshData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Fetch user stats
    await fetchUserStats(user.value.uid)
    
    // Fetch quiz history
    quizHistory.value = await quizStore.fetchUserQuizHistory(user.value.uid)
  } catch (err) {
    error.value = 'Failed to load data'
    console.error('Error loading data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await refreshData()
})
</script>

<style scoped>
.profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  display: flex;
  gap: 2rem;
  align-items: center;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.email {
  color: #666;
  margin-bottom: 1rem;
}

.stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  display: block;
}

.stat-label {
  color: #666;
  font-size: 0.875rem;
}

.quiz-history {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-grid {
  margin-top: 1rem;
  overflow-x: auto;
}

.history-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  background: var(--background-color);
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  min-width: 800px;
}

.history-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  min-width: 800px;
}

.history-row:last-child {
  border-bottom: none;
}

.quiz-title {
  font-weight: 500;
}

.score {
  font-weight: bold;
  color: var(--primary-color);
}

.category {
  color: #1976d2;
}

.difficulty {
  text-transform: capitalize;
}

.loading, .error, .no-history {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #c62828;
}
</style> 