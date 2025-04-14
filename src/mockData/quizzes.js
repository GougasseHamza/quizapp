export const quizzes = [
  {
    id: '1',
    title: 'JavaScript Basics',
    category: 'Programming',
    difficulty: 'Easy',
    questions: [
      {
        id: '1',
        text: 'What is JavaScript?',
        type: 'multiple-choice',
        options: [
          { id: '1', text: 'A programming language' },
          { id: '2', text: 'A coffee brand' },
          { id: '3', text: 'A type of computer' },
          { id: '4', text: 'A web browser' }
        ],
        correctAnswer: '1'
      },
      {
        id: '2',
        text: 'Which of the following is not a JavaScript data type?',
        type: 'multiple-choice',
        options: [
          { id: '1', text: 'String' },
          { id: '2', text: 'Boolean' },
          { id: '3', text: 'Integer' },
          { id: '4', text: 'Float' }
        ],
        correctAnswer: '4'
      }
    ]
  },
  {
    id: '2',
    title: 'Vue.js Fundamentals',
    category: 'Frontend',
    difficulty: 'Medium',
    questions: [
      {
        id: '1',
        text: 'What is Vue.js?',
        type: 'multiple-choice',
        options: [
          { id: '1', text: 'A JavaScript framework' },
          { id: '2', text: 'A database' },
          { id: '3', text: 'A programming language' },
          { id: '4', text: 'A CSS framework' }
        ],
        correctAnswer: '1'
      },
      {
        id: '2',
        text: 'Which Vue.js version are we using in this project?',
        type: 'multiple-choice',
        options: [
          { id: '1', text: 'Vue 2' },
          { id: '2', text: 'Vue 3' },
          { id: '3', text: 'Vue 4' },
          { id: '4', text: 'Vue 1' }
        ],
        correctAnswer: '2'
      }
    ]
  }
] 