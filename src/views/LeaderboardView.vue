<template>
  <div class="leaderboard">
    <h2>Leaderboard</h2>
    
    <div class="filters">
      <select v-model="selectedQuiz" class="filter-select">
        <option value="">All Quizzes</option>
        <option v-for="quiz in availableQuizzes" :key="quiz.id" :value="quiz.id">
          {{ quiz.title }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading">
      Loading scores...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="scores.length === 0" class="no-scores">
      No scores available yet.
    </div>

    <div v-else class="leaderboard-grid">
      <div class="leaderboard-header">
        <div>Rank</div>
        <div>User</div>
        <div>Quiz</div>
        <div>Score</div>
        <div>Date</div>
      </div>
      
      <div v-for="(score, index) in scores" :key="score.id" class="leaderboard-row">
        <div class="rank">{{ index + 1 }}</div>
        <div class="user">{{ score.userName || 'Anonymous' }}</div>
        <div class="quiz">{{ getQuizTitle(score.quizId) }}</div>
        <div class="score">{{ score.score }}/{{ getQuizMaxScore(score.quizId) }}</div>
        <div class="date">{{ formatDate(score.date) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuizStore } from '../stores/quiz'
import { useScoreStore } from '../stores/score'
import { storeToRefs } from 'pinia'

const quizStore = useQuizStore()
const scoreStore = useScoreStore()
const { availableQuizzes } = storeToRefs(quizStore)
const { scores, loading, error } = storeToRefs(scoreStore)

const selectedQuiz = ref('')

// Fetch quizzes when component mounts
onMounted(async () => {
  await quizStore.fetchQuizzes()
  await scoreStore.fetchScores()
})

// Watch for changes in selected quiz
watch(selectedQuiz, async (newQuizId) => {
  await scoreStore.fetchScores(newQuizId)
})

const getQuizTitle = (quizId) => {
  const quiz = availableQuizzes.value.find(q => q.id === quizId)
  return quiz ? quiz.title : 'Unknown Quiz'
}

const getQuizMaxScore = (quizId) => {
  const quiz = availableQuizzes.value.find(q => q.id === quizId)
  return quiz ? quiz.questions.length : 0
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString()
}
</script>

<style scoped>
.leaderboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.filters {
  margin-bottom: 2rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 200px;
}

.leaderboard-grid {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.leaderboard-header {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 100px 120px;
  padding: 1rem;
  background: #f5f5f5;
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
  color: #666;
}

.user {
  font-weight: 500;
}

.score {
  font-weight: bold;
  color: #4caf50;
}

.loading, .error, .no-scores {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #c62828;
}

.no-scores {
  font-style: italic;
}
</style> 