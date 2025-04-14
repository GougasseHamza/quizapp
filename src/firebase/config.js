import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyCuqAE0HLqrzHDDDDSLct2-6XSoS7lR7s4",
  authDomain: "quizz-app-project-e0e46.firebaseapp.com",
  projectId: "quizz-app-project-e0e46",
  storageBucket: "quizz-app-project-e0e46.firebasestorage.app",
  messagingSenderId: "1049584172567",
  appId: "1:1049584172567:web:63eb1d4f5f48da87a2a652",
  measurementId: "G-HW9ZF20HPE"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const analytics = getAnalytics(app)

// Quiz collection reference
const quizzesCollection = collection(db, 'quizzes')

// Function to get all quizzes
const getQuizzes = async () => {
  try {
    const querySnapshot = await getDocs(quizzesCollection)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting quizzes:', error)
    throw error
  }
}

// Function to get a single quiz by ID
const getQuizById = async (quizId) => {
  try {
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId))
    if (quizDoc.exists()) {
      return {
        id: quizDoc.id,
        ...quizDoc.data()
      }
    } else {
      console.log('No such quiz!')
      return null
    }
  } catch (error) {
    console.error('Error getting quiz:', error)
    throw error
  }
}

// Function to add a new quiz
const addQuiz = async (quizData) => {
  try {
    const docRef = await addDoc(quizzesCollection, quizData)
    return docRef.id
  } catch (error) {
    console.error('Error adding quiz:', error)
    throw error
  }
}

// Function to update an existing quiz
const updateQuiz = async (quizId, quizData) => {
  try {
    const quizRef = doc(db, 'quizzes', quizId)
    await updateDoc(quizRef, quizData)
    return true
  } catch (error) {
    console.error('Error updating quiz:', error)
    throw error
  }
}

// Function to delete a quiz
const deleteQuiz = async (quizId) => {
  try {
    await deleteDoc(doc(db, 'quizzes', quizId))
    return true
  } catch (error) {
    console.error('Error deleting quiz:', error)
    throw error
  }
}

export { 
  auth, 
  db, 
  analytics,
  getQuizzes,
  getQuizById,
  addQuiz,
  updateQuiz,
  deleteQuiz
} 