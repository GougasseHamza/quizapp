import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getQuizzes, getQuizById, addQuiz, updateQuiz, deleteQuiz } from '../firebase/config'
import { db } from '../firebase/config'
import { collection, getDocs, addDoc, query, where, orderBy, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useAuthStore } from './auth'

export const useQuizStore = defineStore('quiz', () => {
  const availableQuizzes = ref([])
  const currentQuiz = ref(null)
  const currentQuestionIndex = ref(0)
  const userAnswers = ref([])
  const quizStartTime = ref(null)
  const quizEndTime = ref(null)
  const quizCompleted = ref(false)
  const score = ref(0)
  const loading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()

  // Fetch all quizzes from Firebase
  const fetchQuizzes = async () => {
    loading.value = true
    error.value = null
    try {
      const querySnapshot = await getDocs(collection(db, 'quizzes'))
      availableQuizzes.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      error.value = err.message
      console.error('Error fetching quizzes:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get a quiz by ID from Firebase
  const fetchQuizById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const quiz = availableQuizzes.value.find(q => q.id === id)
      if (quiz) {
        currentQuiz.value = quiz
        console.log('Quiz loaded:', quiz)
        return quiz
      } else {
        error.value = 'Quiz not found'
        return null
      }
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
      const quiz = availableQuizzes.value.find(q => q.id === quizId)
      if (!quiz) throw new Error('Quiz not found')
      
      currentQuiz.value = quiz
      currentQuestionIndex.value = 0
      userAnswers.value = []
      quizStartTime.value = new Date()
      quizCompleted.value = false
      score.value = 0
    } catch (err) {
      error.value = err.message
      console.error('Error starting quiz:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const submitAnswer = (answer) => {
    userAnswers.value.push({
      questionIndex: currentQuestionIndex.value,
      answer
    })

    // Check if answer is correct
    const currentQuestion = currentQuiz.value.questions[currentQuestionIndex.value]
    if (answer === currentQuestion.correctAnswer) {
      score.value++
    }

    // Move to next question or complete quiz
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

  const finishQuiz = async () => {
    if (!currentQuiz.value || !quizCompleted.value) return

    quizEndTime.value = new Date()
    const timeTaken = Math.floor((quizEndTime.value - quizStartTime.value) / 1000)

    try {
      // Save quiz attempt to Firestore
      const quizAttempt = {
        userId: authStore.user.uid,
        quizId: currentQuiz.value.id,
        score: score.value,
        totalQuestions: currentQuiz.value.questions.length,
        timeTaken,
        date: new Date(),
        answers: userAnswers.value,
        quizTitle: currentQuiz.value.title,
        quizCategory: currentQuiz.value.category,
        quizDifficulty: currentQuiz.value.difficulty
      }

      // Save quiz attempt
      await addDoc(collection(db, 'quizAttempts'), quizAttempt)

      // Update user's quiz statistics
      const userStatsRef = doc(db, 'userStats', authStore.user.uid)
      const userStatsDoc = await getDoc(userStatsRef)
      
      const scorePercentage = Math.round((score.value / currentQuiz.value.questions.length) * 100)
      
      if (userStatsDoc.exists()) {
        const currentStats = userStatsDoc.data()
        const newTotalQuizzes = currentStats.totalQuizzes + 1
        const newTotalScore = currentStats.totalScore + scorePercentage
        const newAverageScore = Math.round(newTotalScore / newTotalQuizzes)
        
        await updateDoc(userStatsRef, {
          totalQuizzes: newTotalQuizzes,
          totalScore: newTotalScore,
          averageScore: newAverageScore,
          lastQuizAttempt: new Date()
        })
      } else {
        await setDoc(userStatsRef, {
          totalQuizzes: 1,
          totalScore: scorePercentage,
          averageScore: scorePercentage,
          lastQuizAttempt: new Date()
        })
      }

      // Reset quiz state
      currentQuiz.value = null
      currentQuestionIndex.value = 0
      userAnswers.value = []
      quizStartTime.value = null
      quizEndTime.value = null
      quizCompleted.value = false
      score.value = 0

      return score.value
    } catch (error) {
      console.error('Error saving quiz attempt:', error)
      throw error
    }
  }

  const resetQuiz = () => {
    currentQuiz.value = null
    currentQuestionIndex.value = 0
    userAnswers.value = []
    quizStartTime.value = null
    quizEndTime.value = null
    quizCompleted.value = false
    score.value = 0
  }

  const fetchUserQuizHistory = async (userId) => {
    try {
      const q = query(
        collection(db, 'quizAttempts'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching quiz history:', error)
      throw error
    }
  }

  const calculateUserStats = (quizHistory) => {
    if (!quizHistory.length) return { 
      totalQuizzes: 0, 
      averageScore: 0,
      lastQuizAttempt: null
    }

    const totalQuizzes = quizHistory.length
    const totalScore = quizHistory.reduce((sum, attempt) => {
      return sum + (attempt.score / attempt.totalQuestions) * 100
    }, 0)

    return {
      totalQuizzes,
      averageScore: Math.round(totalScore / totalQuizzes),
      lastQuizAttempt: quizHistory[0]?.date || null
    }
  }

  return {
    availableQuizzes,
    currentQuiz,
    currentQuestion,
    currentQuestionIndex,
    userAnswers,
    quizStartTime,
    quizEndTime,
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
    resetQuiz,
    finishQuiz,
    fetchUserQuizHistory,
    calculateUserStats
  }
}) 