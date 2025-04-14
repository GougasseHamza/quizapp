<template>
  <div class="profile">
    <div class="profile-header">
      <div class="avatar">
        <img :src="user.avatar || 'https://via.placeholder.com/150'" alt="User avatar">
      </div>
      <div class="user-info">
        <h2>{{ user.name }}</h2>
        <p class="email">{{ user.email }}</p>
        <div class="stats">
          <div class="stat">
            <span class="stat-value">{{ user.quizzesTaken }}</span>
            <span class="stat-label">Quizzes Taken</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ user.averageScore }}%</span>
            <span class="stat-label">Average Score</span>
          </div>
        </div>
      </div>
    </div>

    <div class="quiz-history">
      <h3>Quiz History</h3>
      <div class="history-grid">
        <div class="history-header">
          <div>Quiz</div>
          <div>Score</div>
          <div>Date</div>
          <div>Time</div>
        </div>
        
        <div v-for="attempt in quizHistory" :key="attempt.id" class="history-row">
          <div class="quiz-title">{{ getQuizTitle(attempt.quizId) }}</div>
          <div class="score">{{ attempt.score }}/{{ getQuizMaxScore(attempt.quizId) }}</div>
          <div class="date">{{ formatDate(attempt.date) }}</div>
          <div class="time">{{ formatTime(attempt.time) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuizStore } from '../stores/quiz'
import { storeToRefs } from 'pinia'

const quizStore = useQuizStore()
const { availableQuizzes } = storeToRefs(quizStore)

// Mock user data - will be replaced with actual data from backend
const user = ref({
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
  quizzesTaken: 5,
  averageScore: 85
})

// Mock quiz history - will be replaced with actual data from backend
const quizHistory = ref([
  { id: '1', quizId: '1', score: 8, date: '2024-04-14', time: 120 },
  { id: '2', quizId: '2', score: 7, date: '2024-04-13', time: 150 }
])

const getQuizTitle = (quizId) => {
  const quiz = availableQuizzes.value.find(q => q.id === quizId)
  return quiz ? quiz.title : 'Unknown Quiz'
}

const getQuizMaxScore = (quizId) => {
  const quiz = availableQuizzes.value.find(q => q.id === quizId)
  return quiz ? quiz.questions.length : 0
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}
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
}

.history-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 1rem;
  background: var(--background-color);
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.history-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #eee;
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
</style> 