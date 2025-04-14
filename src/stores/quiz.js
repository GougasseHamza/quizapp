import { defineStore } from 'pinia'

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    currentQuestion: 0,
    score: 0,
    answers: []
  }),
  
  actions: {
    setAnswer(answer) {
      this.answers[this.currentQuestion] = answer
    },
    nextQuestion() {
      this.currentQuestion++
    },
    previousQuestion() {
      this.currentQuestion--
    },
    resetQuiz() {
      this.currentQuestion = 0
      this.score = 0
      this.answers = []
    }
  }
}) 