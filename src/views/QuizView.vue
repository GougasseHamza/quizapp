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
      <div class="result-card" :class="scoreFeedbackClass">
        <div class="result-header">
          <h2>Quiz Completed!</h2>
          <div class="score-badge">
            <span class="score-number">{{ score }}/{{ currentQuiz.questions.length }}</span>
            <span class="score-percentage">{{ scorePercentage }}%</span>
          </div>
        </div>
        
        <!-- Score-based feedback messages with emojis -->
        <div class="feedback-message">
          <div class="emoji-container">
            <span class="emoji">{{ scoreEmoji }}</span>
          </div>
          <h3>{{ scoreFeedbackTitle }}</h3>
          <p>{{ scoreFeedbackMessage }}</p>
        </div>
        
        <button @click="handleReset" class="reset-button">Back to Quizzes</button>
      </div>
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
import { onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()
const { currentQuiz, currentQuestion, currentQuestionIndex, quizCompleted, score, loading, error } = storeToRefs(quizStore)
const { startQuiz, submitAnswer, resetQuiz } = quizStore

// Watch for route changes to load the correct quiz
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await loadQuiz(newId)
  }
}, { immediate: true })

// Load quiz function
const loadQuiz = async (quizId) => {
  try {
    await startQuiz(quizId)
  } catch (err) {
    console.error('Error loading quiz:', err)
  }
}

onMounted(async () => {
  if (route.params.id) {
    await loadQuiz(route.params.id)
  } else {
    router.push('/')
  }
})

const handleReset = async () => {
  try {
    if (quizCompleted.value) {
      await quizStore.finishQuiz()
    }
    resetQuiz()
    router.push('/')
  } catch (error) {
    console.error('Error saving quiz results:', error)
    // Still reset and navigate even if save fails
    resetQuiz()
    router.push('/')
  }
}

// Calculate score percentage
const scorePercentage = computed(() => {
  if (!quizCompleted.value || !currentQuiz.value || currentQuiz.value.questions.length === 0) return 0
  return Math.round((score.value / currentQuiz.value.questions.length) * 100)
})

// Determine feedback based on score percentage
const scoreFeedbackClass = computed(() => {
  const percentage = scorePercentage.value
  
  if (percentage < 20) return 'poor'
  if (percentage < 40) return 'fair'
  if (percentage < 60) return 'good'
  if (percentage < 80) return 'very-good'
  return 'excellent'
})

// Get emoji based on score
const scoreEmoji = computed(() => {
  const percentage = scorePercentage.value
  
  if (percentage < 20) return '😔'
  if (percentage < 40) return '🤔'
  if (percentage < 60) return '😊'
  if (percentage < 80) return '🎉'
  return '🏆'
})

// Get feedback title based on score
const scoreFeedbackTitle = computed(() => {
  const percentage = scorePercentage.value
  
  if (percentage < 20) return 'Keep Learning!'
  if (percentage < 40) return 'You\'re Getting There!'
  if (percentage < 60) return 'Good Job!'
  if (percentage < 80) return 'Very Good!'
  return 'Excellent Work!'
})

// Get feedback message based on score
const scoreFeedbackMessage = computed(() => {
  const percentage = scorePercentage.value
  
  if (percentage < 20) return 'You might need to review this topic more thoroughly. Don\'t give up!'
  if (percentage < 40) return 'You\'re making progress, but there\'s still room for improvement. Keep practicing!'
  if (percentage < 60) return 'You\'ve got a good understanding of the basics. Keep learning to improve further!'
  if (percentage < 80) return 'You have a strong grasp of this topic. Great work!'
  return 'Outstanding! You\'ve mastered this quiz. You\'re ready for more challenging questions!'
})
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
  display: flex;
  justify-content: center;
}

.result-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  animation: fadeIn 0.5s ease-out, slideUp 0.5s ease-out;
  position: relative;
  overflow: hidden;
}

.result-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
}

.result-header {
  margin-bottom: 2rem;
}

.score-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin: 1rem auto;
  animation: pulse 2s infinite;
}

.score-number {
  font-size: 1.8rem;
  font-weight: bold;
}

.score-percentage {
  font-size: 1.2rem;
  font-weight: bold;
}

.feedback-message {
  margin: 2rem auto;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 500px;
  animation: fadeIn 0.8s ease-out;
}

.emoji-container {
  margin-bottom: 1rem;
  animation: bounce 1s ease infinite;
}

.emoji {
  font-size: 4rem;
  display: inline-block;
}

.feedback-message h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.poor {
  border: 1px solid #ef9a9a;
}

.poor::before {
  background-color: #c62828;
}

.poor .score-badge {
  background-color: #ffebee;
  color: #c62828;
}

.fair {
  border: 1px solid #ffe082;
}

.fair::before {
  background-color: #ff8f00;
}

.fair .score-badge {
  background-color: #fff8e1;
  color: #ff8f00;
}

.good {
  border: 1px solid #a5d6a7;
}

.good::before {
  background-color: #2e7d32;
}

.good .score-badge {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.very-good {
  border: 1px solid #90caf9;
}

.very-good::before {
  background-color: #1565c0;
}

.very-good .score-badge {
  background-color: #e3f2fd;
  color: #1565c0;
}

.excellent {
  border: 1px solid #ce93d8;
}

.excellent::before {
  background-color: #7b1fa2;
}

.excellent .score-badge {
  background-color: #f3e5f5;
  color: #7b1fa2;
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
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.reset-button:hover {
  background-color: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style> 