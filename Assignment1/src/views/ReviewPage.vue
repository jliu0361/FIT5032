<template>
  <div class="app">
    <Header />

    <main class="content">
      <div class="container">
        <div class="card">
          <h2>Rate SportMate</h2>
          <p> </p>

          <form @submit.prevent="submitRating">
            <div class="rating-section">
              <label>Your Rating</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="1"
                v-model="rating"
                class="slider"
              />
              <div class="labels">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
              <div class="rating-text">
                {{ getRatingText(rating) }}
              </div>
            </div>

            <button type="submit" :disabled="loading || rating === 0">
              {{ loading ? 'Submitting...' : 'Submit Rating' }}
            </button>
          </form>
        </div>

        <div class="card">
          <h3>Overall Average Rating</h3>
          <div class="rating-display">
            <span class="number">{{ averageRating.toFixed(1) }}</span>
            <span class="count">({{ totalRatings }} ratings)</span>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { auth, db } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'
import Header from './HeaderPage.vue'
import Footer from './FooterPage.vue'

const currentUser = ref(null)
const loading = ref(false)
const ratings = ref([])
const rating = ref(0)

const averageRating = computed(() => {
  if (ratings.value.length === 0) {
    console.log('No ratings found, returning 0')
    return 0
  }
  let sum = 0
  for (let i = 0; i < ratings.value.length; i++) {
    sum += ratings.value[i].rating
    console.log(`Adding rating ${i+1}: ${ratings.value[i].rating}, running sum: ${sum}`)
  }
  const average = sum / ratings.value.length
  console.log(`Final calculation: ${sum} / ${ratings.value.length} = ${average}`)
  return average
})

const totalRatings = computed(() => ratings.value.length)

const getRatingText = (value) => {
  if (value === 1) return 'Poor'
  if (value === 2) return 'Fair'
  if (value === 3) return 'Good'
  if (value === 4) return 'Very Good'
  if (value === 5) return 'Excellent'
  return ''
}

const loadRatings = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'users'))
    ratings.value = []
    console.log('Total documents found:', snapshot.size)
    snapshot.forEach((doc) => {
      const data = doc.data()
      console.log('Document data:', doc.id, data)
      if (data.rating) {
        const ratingValue = Number(data.rating)
        ratings.value.push({
          id: doc.id,
          rating: ratingValue
        })
        console.log('Added rating:', ratingValue, 'for user:', doc.id)
      }
    })
    console.log('All ratings array:', ratings.value)
    console.log('Calculated average:', averageRating.value)
  } catch (error) {
    console.log('Error loading ratings:', error)
  }
}

const submitRating = async () => {
  if (!currentUser.value || rating.value === 0) return
  
  loading.value = true
  
  try {
    await setDoc(doc(db, 'users', currentUser.value.uid), {
      rating: rating.value
    }, { merge: true })
    
    rating.value = 0
    await loadRatings()
    
  } catch (error) {
    console.log('Error submitting rating:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    if (user) {
      loadRatings()
    }
  })
})
</script>

<style scoped>
.content {
  padding: 20px;
}

.card {
  background: white;
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.slider {
  width: 100%;
  margin: 10px 0;
}

.labels {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.rating-display {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.number {
  font-size: 24px;
  font-weight: bold;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
}
</style>