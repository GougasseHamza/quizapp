<template>
  <div class="home">
    <h1>Welcome to the Quiz App</h1>
    <p>Test your knowledge with our interactive quiz!</p>
    <button @click="startQuiz" class="start-button">Start Quiz</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const startQuiz = () => {
  router.push('/quiz')
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

.start-button {
  background-color: #4CAF50;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 2rem;
}

.start-button:hover {
  background-color: #45a049;
}
</style> 