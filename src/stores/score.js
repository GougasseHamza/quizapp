import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp, where } from 'firebase/firestore'
import { db } from '../firebase/config'

export const useScoreStore = defineStore('score', () => {
  const scores = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch scores from Firestore
  const fetchScores = async (quizId = null) => {
    loading.value = true
    error.value = null
    try {
      console.log('Fetching scores...', quizId ? `for quiz: ${quizId}` : 'all scores')
      let q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(100))
      const snapshot = await getDocs(q)
      console.log('Snapshot size:', snapshot.size)
      
      let scoresData = snapshot.docs.map(doc => {
        const data = {
          id: doc.id,
          ...doc.data()
        }
        console.log('Score data:', data)
        return data
      })

      // Filter by quizId in memory if provided
      if (quizId) {
        console.log('Filtering scores for quiz:', quizId)
        scoresData = scoresData.filter(score => {
          console.log('Checking score:', score.quizId, 'against:', quizId)
          return score.quizId === quizId
        })
      }
      
      console.log('Final scores data:', scoresData)
      scores.value = scoresData
    } catch (err) {
      error.value = err.message
      console.error('Error fetching scores:', err)
    } finally {
      loading.value = false
    }
  }

  // Add a new score
  const addScore = async (scoreData) => {
    loading.value = true
    error.value = null
    try {
      const scoreWithTimestamp = {
        ...scoreData,
        date: serverTimestamp()
      }
      const docRef = await addDoc(collection(db, 'scores'), scoreWithTimestamp)
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('Error adding score:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    scores,
    loading,
    error,
    fetchScores,
    addScore
  }
}) 