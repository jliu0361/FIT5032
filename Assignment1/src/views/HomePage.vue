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
                <div class="feature-icon">
                  <i class="fas fa-building"></i>
                </div>
                <h3>Community</h3>
                <p>Connect with like-minded people who share your passion for sports and fitness.</p>
              </div>
            </div>
            
            <div class="col-12 col-md-4">
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="fas fa-home"></i>
                </div>
                <h3>Local Activities</h3>
                <p>Discover sports activities in your area and meet people from your community.</p>
              </div>
            </div>
            
            <div class="col-12 col-md-4">
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="fas fa-heart"></i>
                </div>
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
    return userDoc.exists() ? userDoc.data().role : 'user'
  } catch (error) {
    console.error('Error getting user role:', error)
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
.movemate-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.home-content {
  flex: 1;
  background: linear-gradient(to bottom, #fff4e6, #f8f9fa);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.home-section {
  padding: 4rem 0;
  background: white;
}


.home-title {
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.home-description {
  font-size: 1.2rem;
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.browse-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.browse-btn:hover {
  background: #5a67d8;
}


.sport-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid #f8f9fa;
}

.sport-card:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.sport-image {
  width: 100%;
  height: 120px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}



.sport-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.sport-label {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
  margin-top: 0.5rem;
}


.sport-card h3 {
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.features-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.features-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 3rem;
}


.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.feature-card:hover {
  background: #f8f9ff;
  border: 2px solid #667eea;
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
}

.feature-card h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #6c757d;
  line-height: 1.6;
  margin: 0;
}

</style>