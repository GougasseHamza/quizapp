<template>
  <div class="leaderboard">
    <h2>Leaderboard</h2>
    
    <div class="filters">
      <select v-model="selectedQuiz" class="filter-select">
        <option value="">All Quizzes</option>
        <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
          {{ quiz.title }}
        </option>
      </select>
    </div>

    <div class="leaderboard-grid">
      <div class="leaderboard-header">
        <div>Rank</div>
        <div>User</div>
        <div>Quiz</div>
        <div>Score</div>
        <div>Date</div>
      </div>
      
      <div v-for="(score, index) in filteredScores" :key="score.id" class="leaderboard-row">
        <div class="rank">{{ index + 1 }}</div>
        <div class="user">{{ score.userName }}</div>
        <div class="quiz">{{ getQuizTitle(score.quizId) }}</div>
        <div class="score">{{ score.score }}/{{ getQuizMaxScore(score.quizId) }}</div>
        <div class="date">{{ formatDate(score.date) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuizStore } from '../stores/quiz'
import { storeToRefs } from 'pinia'

const quizStore = useQuizStore()
const { availableQuizzes } = storeToRefs(quizStore)
const selectedQuiz = ref('')

// Mock data - will be replaced with actual data from backend
const mockScores = [
  { id: '1', userName: 'John Doe', quizId: '1', score: 8, date: '2024-04-14' },
  { id: '2', userName: 'Jane Smith', quizId: '1', score: 7, date: '2024-04-14' },
  { id: '3', userName: 'Bob Johnson', quizId: '2', score: 9, date: '2024-04-13' },
]

const filteredScores = computed(() => {
  if (!selectedQuiz.value) return mockScores
  return mockScores.filter(score => score.quizId === selectedQuiz.value)
})

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
</script>

<style scoped>
.leaderboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.filters {
  margin: 2rem 0;
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-width: 200px;
}

.leaderboard-grid {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.leaderboard-header {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 100px 120px;
  padding: 1rem;
  background: var(--background-color);
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.leaderboard-row {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 100px 120px;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.leaderboard-row:last-child {
  border-bottom: none;
}

.rank {
  font-weight: bold;
  color: var(--primary-color);
}

.score {
  font-weight: bold;
}
</style> 