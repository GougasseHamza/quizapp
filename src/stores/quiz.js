import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { quizzes } from '../mockData/quizzes'

export const useQuizStore = defineStore('quiz', () => {
  const availableQuizzes = ref(quizzes)
  const currentQuiz = ref(null)
  const currentQuestionIndex = ref(0)
  const userAnswers = ref([])
  const quizCompleted = ref(false)

  const getQuizById = (id) => {
    return availableQuizzes.value.find(quiz => quiz.id === id)
  }

  const startQuiz = (quizId) => {
    currentQuiz.value = getQuizById(quizId)
    currentQuestionIndex.value = 0
    userAnswers.value = []
    quizCompleted.value = false
  }

  const submitAnswer = (answer) => {
    userAnswers.value.push({
      questionId: currentQuiz.value.questions[currentQuestionIndex.value].id,
      answer
    })

    if (currentQuestionIndex.value < currentQuiz.value.questions.length - 1) {
      currentQuestionIndex.value++
    } else {
      quizCompleted.value = true
    }
  }

  const currentQuestion = computed(() => {
    if (!currentQuiz.value) return null
    return currentQuiz.value.questions[currentQuestionIndex.value]
  })

  const score = computed(() => {
    if (!quizCompleted.value) return 0
    return userAnswers.value.reduce((total, userAnswer) => {
      const question = currentQuiz.value.questions.find(q => q.id === userAnswer.questionId)
      return total + (question.correctAnswer === userAnswer.answer ? 1 : 0)
    }, 0)
  })

  const resetQuiz = () => {
    currentQuiz.value = null
    currentQuestionIndex.value = 0
    userAnswers.value = []
    quizCompleted.value = false
  }

  return {
    availableQuizzes,
    currentQuiz,
    currentQuestion,
    currentQuestionIndex,
    userAnswers,
    quizCompleted,
    score,
    startQuiz,
    submitAnswer,
    resetQuiz
  }
}) 