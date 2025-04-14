<template>
  <div class="quiz">
    <div v-if="loading" class="loading">
      <p>Loading quiz...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="router.push('/')" class="reset-button">Back to Home</button>
    </div>
    <div v-else-if="!currentQuiz" class="loading">
      <p>Loading quiz...</p>
    </div>
    <div v-else-if="quizCompleted" class="results">
      <h2>Quiz Completed!</h2>
      <p>Your score: {{ score }}/{{ currentQuiz.questions.length }}</p>
      <button @click="handleReset" class="reset-button">Back to Quizzes</button>
    </div>
    <div v-else class="question-container">
      <div class="progress">
        Question {{ currentQuestionIndex + 1 }} of {{ currentQuiz.questions.length }}
      </div>
      <h2>{{ currentQuestion.text }}</h2>
      <div class="options">
        <div
          v-for="option in currentQuestion.options"
          :key="option.id"
          class="option"
          @click="submitAnswer(option.id)"
        >
          {{ option.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuizStore } from '../stores/quiz'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()
const { currentQuiz, currentQuestion, currentQuestionIndex, quizCompleted, score, loading, error } = storeToRefs(quizStore)
const { startQuiz, submitAnswer, resetQuiz } = quizStore

onMounted(async () => {
  if (route.params.id) {
    await startQuiz(route.params.id)
  } else {
    router.push('/')
  }
})

const handleReset = () => {
  resetQuiz()
  router.push('/')
}
</script>

<style scoped>
.quiz {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #c62828;
}

.results {
  text-align: center;
  padding: 2rem;
}

.question-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress {
  margin-bottom: 1rem;
  color: #666;
}

.options {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

.option {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.option:hover {
  background: #e0e0e0;
}

.reset-button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.reset-button:hover {
  background-color: #1976d2;
}
</style> 