<template>
  <div class="movemate-app">
    <Header />

    <main class="home-content">
      <div class="home-section">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-12 col-lg-6 mb-4 mb-lg-0">
              <h1 class="home-title">Explore Local Sporting Activities</h1>
              <p class="home-description">
                Discover amazing sports activities in your community. Connect with fellow sports, no matter you're a beginner or an expert, 
                there's something for you.
              </p>
              <button class="browse-btn" @click="goToActivities">
                Browse Activities
              </button>
              <button class="browse-btn" style="margin-left: 0.5rem" @click="sendAttachmentEmail">
                Follow Us
              </button>
              
              <div class="weather-card" v-if="weather">
                <div class="weather-header">Melbourne Now</div>
                <div class="weather-body">
                  <div class="weather-main">
                    <div class="weather-temp">{{ displayTemp }}°C</div>
                  </div>
                </div>
                <div class="weather-updated" v-if="weather.lastUpdatedEpoch">
                  Updated: {{ new Date(weather.lastUpdatedEpoch * 1000).toLocaleString() }}
                </div>
              </div>
              <div v-else-if="weatherLoading" class="weather-loading">Loading weather…</div>
              <div v-else-if="weatherError" class="weather-error">Failed to load weather.</div>
              
            </div>
            <div class="col-12 col-lg-6">
              <div class="row g-3">
                <div class="col-6">
                  <div class="sport-card">
                    <div class="sport-image">
                      <img src="/running.png" alt="Running" class="sport-icon-img" />
                    </div>
                    <div class="sport-label">Running</div>
                  </div>
                </div>
                
                <div class="col-6">
                  <div class="sport-card">
                    <div class="sport-image">
                      <img src="/basketball.png" alt="Basketball" class="sport-icon-img" />
                    </div>
                    <div class="sport-label">Basketball</div>
                  </div>
                </div>
                
                <div class="col-6">
                  <div class="sport-card">
                    <div class="sport-image">
                      <img src="/swimming.png" alt="Swimming" class="sport-icon-img" />
                    </div>
                    <div class="sport-label">Swimming</div>
                  </div>
                </div>
                
                <div class="col-6">
                  <div class="sport-card">
                    <div class="sport-image">
                      <img src="/tennis.png" alt="Tennis" class="sport-icon-img" />
                    </div>
                    <div class="sport-label">Tennis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="features-section">
        <div class="container">
          <h2 class="features-title">Why Choose SportMate?</h2>
          <div class="row g-4">
            <div class="col-12 col-md-4">
              <div class="feature-card">
                <h3>Community</h3>
                <p>Connect with like-minded people who share your passion for sports and fitness.</p>
              </div>
            </div>
            
            <div class="col-12 col-md-4">
              <div class="feature-card">
                <h3>Local Activities</h3>
                <p>Discover sports activities in your area and meet people from your community.</p>
              </div>
            </div>
            
            <div class="col-12 col-md-4">
              <div class="feature-card">
                <h3>Health & Wellness</h3>
                <p>Improve your physical and mental health through regular sports activities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import Header from './HeaderPage.vue'
import Footer from './FooterPage.vue'
const getFunctionsBaseUrl = () => {
  const override = import.meta?.env?.VITE_FUNCTIONS_BASE_URL
  if (override) return override.replace(/\/$/, '')
  const host = window.location?.hostname
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://127.0.0.1:5001/sportmate-4272f/australia-southeast2'
  }
  return ''
}

const router = useRouter()
const currentUser = ref(null)

const goToActivities = () => {
  router.push('/all-activities')
}

const sendAttachmentEmail = async () => {
  try {
    const to = prompt('Enter your email address')
    if (!to) return
    const base = getFunctionsBaseUrl()
    const endpoint = base ? `${base}/sendEmailWithAttachment` : '/sendEmailWithAttachment'
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to })
    })
    if (!res.ok) {
      alert('Failed to send email')
      return
    }
    alert('Email sent!')
  } catch (e) {
    alert('Failed to send email')
  }
}


const weather = ref(null)
const weatherLoading = ref(false)
const weatherError = ref(false)

const displayTemp = computed(() => {
  if (!weather.value || typeof weather.value.tempC !== 'number') return '—'
  return Math.round(weather.value.tempC)
})

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    if (!user) {
      router.push('/login')
    }
  })
  ;(async () => {
    try {
      weatherLoading.value = true
      const base = getFunctionsBaseUrl()
      const endpoint = base ? `${base}/getMelbourneWeather` : '/getMelbourneWeather'
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error('weather failed')
      const data = await res.json()
      weather.value = data
    } catch (e) {
      weatherError.value = true
    } finally {
      weatherLoading.value = false
    }
  })()
})
</script>

<style scoped>
.home-content {
  background: #f8f9fa;
}

.home-section {
  padding: 3rem 0;
  background: white;
}

.home-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.home-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.browse-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.browse-btn:hover {
  background: #0056b3;
}

.weather-card {
  margin-top: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f7fbff;
  padding: 1rem;
}

.weather-header {
  font-weight: 600;
  color: #0b5ed7;
  margin-bottom: 0.5rem;
}

.weather-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.weather-main {
  display: flex;
  flex-direction: column;
}

.weather-temp {
  font-size: 2rem;
  font-weight: 700;
  color: #0b5ed7;
}

.weather-loading, .weather-error {
  margin-top: 0.75rem;
  color: #666;
}

.sport-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
}

.sport-image {
  width: 100%;
  height: 100px;
  background: #f8f9fa;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sport-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sport-label {
  font-size: 0.9rem;
  color: #333;
  margin: 0;
}

.features-section {
  padding: 3rem 0;
  background: #f8f9fa;
}

.features-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #666;
  margin: 0;
}
</style>