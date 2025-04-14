import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getQuizzes, getQuizById, addQuiz, updateQuiz, deleteQuiz } from '../firebase/config'

export const useQuizStore = defineStore('quiz', () => {
  const availableQuizzes = ref([])
  const currentQuiz = ref(null)
  const currentQuestionIndex = ref(0)
  const userAnswers = ref([])
  const quizCompleted = ref(false)
  const loading = ref(false)
  const error = ref(null)

  // Fetch all quizzes from Firebase
  const fetchQuizzes = async () => {
    loading.value = true
    error.value = null
    try {
      availableQuizzes.value = await getQuizzes()
    } catch (err) {
      error.value = err.message
      console.error('Error fetching quizzes:', err)
    } finally {
      loading.value = false
    }
  }

  // Get a quiz by ID from Firebase
  const fetchQuizById = async (id) => {
    loading.value = true
    error.value = null
    try {
      return await getQuizById(id)
    } catch (err) {
      error.value = err.message
      console.error('Error fetching quiz:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Add a new quiz to Firebase
  const createQuiz = async (quizData) => {
    loading.value = true
    error.value = null
    try {
      const quizId = await addQuiz(quizData)
      // Refresh quizzes list
      await fetchQuizzes()
      return quizId
    } catch (err) {
      error.value = err.message
      console.error('Error creating quiz:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Update an existing quiz in Firebase
  const editQuiz = async (quizId, quizData) => {
    loading.value = true
    error.value = null
    try {
      await updateQuiz(quizId, quizData)
      // Refresh quizzes list
      await fetchQuizzes()
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error updating quiz:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete a quiz from Firebase
  const removeQuiz = async (quizId) => {
    loading.value = true
    error.value = null
    try {
      await deleteQuiz(quizId)
      // Refresh quizzes list
      await fetchQuizzes()
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error deleting quiz:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const startQuiz = async (quizId) => {
    loading.value = true
    error.value = null
    try {
      // Reset quiz state
      currentQuiz.value = null
      currentQuestionIndex.value = 0
      userAnswers.value = []
      quizCompleted.value = false
      
      // Fetch quiz from Firebase
      const quiz = await getQuizById(quizId)
      
      if (quiz) {
        // Set current quiz
        currentQuiz.value = quiz
        console.log('Quiz loaded:', quiz)
      } else {
        error.value = 'Quiz not found'
      }
    } catch (err) {
      error.value = err.message
      console.error('Error starting quiz:', err)
    } finally {
      loading.value = false
    }
  }

  const submitAnswer = (answer) => {
    if (!currentQuiz.value || !currentQuestion.value) return
    
    userAnswers.value.push({
      questionId: currentQuestion.value.id,
      answer
    })

    if (currentQuestionIndex.value < currentQuiz.value.questions.length - 1) {
      currentQuestionIndex.value++
    } else {
      quizCompleted.value = true
    }
  }

  const currentQuestion = computed(() => {
    if (!currentQuiz.value || !currentQuiz.value.questions) return null
    return currentQuiz.value.questions[currentQuestionIndex.value]
  })

  const score = computed(() => {
    if (!quizCompleted.value || !currentQuiz.value) return 0
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
    loading,
    error,
    fetchQuizzes,
    fetchQuizById,
    createQuiz,
    editQuiz,
    removeQuiz,
    startQuiz,
    submitAnswer,
    resetQuiz
  }
}) 