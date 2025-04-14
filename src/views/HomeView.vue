<template>
  <div class="home">
    <h2>Available Quizzes</h2>
    
    <div v-if="loading" class="loading">
      Loading quizzes...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="availableQuizzes.length === 0" class="no-quizzes">
      No quizzes available. Check back later!
    </div>
    
    <div v-else class="quiz-grid">
      <div v-for="quiz in availableQuizzes" :key="quiz.id" class="quiz-card">
        <h3>{{ quiz.title }}</h3>
        <div class="quiz-info">
          <span class="category">{{ quiz.category }}</span>
          <span class="difficulty">{{ quiz.difficulty }}</span>
        </div>
        <p>{{ quiz.questions.length }} questions</p>
        <router-link :to="`/quiz/${quiz.id}`" class="start-button">Start Quiz</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuizStore } from '../stores/quiz'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const quizStore = useQuizStore()
const { availableQuizzes, loading, error } = storeToRefs(quizStore)
const { startQuiz } = quizStore

// Fetch quizzes when component mounts
onMounted(async () => {
  await quizStore.fetchQuizzes()
})

// Navigate to quiz page
const handleStartQuiz = (quizId) => {
  router.push(`/quiz/${quizId}`)
}
</script>

<style scoped>
.home {
  padding: 2rem;
}

.loading, .error, .no-quizzes {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #c62828;
}

.quiz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.quiz-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.quiz-card:hover {
  transform: translateY(-5px);
}

.quiz-info {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
}

.category, .difficulty {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.category {
  background-color: #e3f2fd;
  color: #1976d2;
}

.difficulty {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.start-button {
  background-color: #4caf50;
  text-align: center;
  display: inline-block;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

.start-button:hover {
  background-color: #388e3c;
}
</style> 