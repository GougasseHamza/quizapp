<template>
  <div class="admin">
    <h2>Admin Dashboard</h2>
    
    <div class="admin-actions">
      <button @click="showCreateQuiz = true" class="action-button">
        Create New Quiz
      </button>
    </div>

    <div class="quizzes-list">
      <h3>Manage Quizzes</h3>
      <div class="quiz-grid">
        <div v-for="quiz in availableQuizzes" :key="quiz.id" class="quiz-card">
          <div class="quiz-header">
            <h4>{{ quiz.title }}</h4>
            <div class="quiz-actions">
              <button @click="editQuiz(quiz)" class="icon-button">
                <span class="material-icons">edit</span>
              </button>
              <button @click="deleteQuiz(quiz.id)" class="icon-button">
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>
          <div class="quiz-info">
            <span class="category">{{ quiz.category }}</span>
            <span class="difficulty">{{ quiz.difficulty }}</span>
          </div>
          <p>{{ quiz.questions.length }} questions</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Quiz Modal -->
    <div v-if="showCreateQuiz" class="modal">
      <div class="modal-content">
        <h3>{{ editingQuiz ? 'Edit Quiz' : 'Create New Quiz' }}</h3>
        <form @submit.prevent="saveQuiz">
          <div class="form-group">
            <label>Title</label>
            <input v-model="quizForm.title" type="text" required>
          </div>
          <div class="form-group">
            <label>Category</label>
            <input v-model="quizForm.category" type="text" required>
          </div>
          <div class="form-group">
            <label>Difficulty</label>
            <select v-model="quizForm.difficulty" required>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div class="questions-section">
            <h4>Questions</h4>
            <div v-for="(question, index) in quizForm.questions" :key="index" class="question-item">
              <div class="question-header">
                <h5>Question {{ index + 1 }}</h5>
                <button type="button" @click="removeQuestion(index)" class="icon-button">
                  <span class="material-icons">delete</span>
                </button>
              </div>
              <div class="form-group">
                <label>Question Text</label>
                <input v-model="question.text" type="text" required>
              </div>
              <div class="form-group">
                <label>Options</label>
                <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-item">
                  <input v-model="option.text" type="text" required>
                  <input type="radio" v-model="question.correctAnswer" :value="option.id">
                </div>
                <button type="button" @click="addOption(index)" class="add-option">
                  Add Option
                </button>
              </div>
            </div>
            <button type="button" @click="addQuestion" class="add-question">
              Add Question
            </button>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showCreateQuiz = false" class="cancel-button">
              Cancel
            </button>
            <button type="submit" class="save-button">
              {{ editingQuiz ? 'Update Quiz' : 'Create Quiz' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuizStore } from '../stores/quiz'
import { storeToRefs } from 'pinia'

const quizStore = useQuizStore()
const { availableQuizzes } = storeToRefs(quizStore)

const showCreateQuiz = ref(false)
const editingQuiz = ref(null)

const quizForm = reactive({
  title: '',
  category: '',
  difficulty: 'Easy',
  questions: [
    {
      text: '',
      options: [
        { id: '1', text: '' },
        { id: '2', text: '' }
      ],
      correctAnswer: '1'
    }
  ]
})

const editQuiz = (quiz) => {
  editingQuiz.value = quiz
  quizForm.title = quiz.title
  quizForm.category = quiz.category
  quizForm.difficulty = quiz.difficulty
  quizForm.questions = [...quiz.questions]
  showCreateQuiz.value = true
}

const addQuestion = () => {
  quizForm.questions.push({
    text: '',
    options: [
      { id: '1', text: '' },
      { id: '2', text: '' }
    ],
    correctAnswer: '1'
  })
}

const removeQuestion = (index) => {
  quizForm.questions.splice(index, 1)
}

const addOption = (questionIndex) => {
  const newId = (quizForm.questions[questionIndex].options.length + 1).toString()
  quizForm.questions[questionIndex].options.push({
    id: newId,
    text: ''
  })
}

const saveQuiz = () => {
  // TODO: Implement save logic with backend
  showCreateQuiz.value = false
  editingQuiz.value = null
  resetForm()
}

const deleteQuiz = (id) => {
  // TODO: Implement delete logic with backend
  if (confirm('Are you sure you want to delete this quiz?')) {
    console.log('Delete quiz:', id)
  }
}

const resetForm = () => {
  quizForm.title = ''
  quizForm.category = ''
  quizForm.difficulty = 'Easy'
  quizForm.questions = [
    {
      text: '',
      options: [
        { id: '1', text: '' },
        { id: '2', text: '' }
      ],
      correctAnswer: '1'
    }
  ]
}
</script>

<style scoped>
.admin {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-actions {
  margin-bottom: 2rem;
}

.action-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
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
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.quiz-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #666;
}

.icon-button:hover {
  color: var(--primary-color);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.questions-section {
  margin-top: 2rem;
}

.question-item {
  background: var(--background-color);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.option-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.add-option,
.add-question {
  background: none;
  border: 1px dashed #666;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button {
  background: none;
  border: 1px solid #666;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style> 