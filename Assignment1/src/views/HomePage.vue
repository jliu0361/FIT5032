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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import Header from './HeaderPage.vue'
import Footer from './FooterPage.vue'

const router = useRouter()
const currentUser = ref(null)
const userRole = ref(null)

const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data().role
    } else {
      return 'user'
    }
  } catch (error) {
    return 'user'
  }
}

const goToActivities = () => {
  router.push('/all-activities')
}

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    if (user) {
      userRole.value = await getUserRole(user.uid)
    } else {
      userRole.value = null
      router.push('/login')
    }
  })
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