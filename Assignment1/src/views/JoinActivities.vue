<template>
  <div class="movemate-app">
    <Header />

    <main class="activities-content">
      <div class="content-container">
        <div class="form-section">
          <div class="user-info-header">
            <h1 class="main-title">Find Your Preferred Sport Activity</h1>
          </div>
          <p class="subtitle">Join activities that match your preferences!</p>

          <form class="preference-form" @submit.prevent="findSports">
            <div class="row mb-3">
              <div class="col-12 col-md-6 mb-3 mb-md-0">
                <div class="form-group">
                  <label for="gender" class="form-label">Gender:</label>
                  <select
                    id="gender"
                    class="form-select"
                    v-model="formData.gender"
                    @blur="() => validateGender(true)"
                    @change="() => validateGender(false)"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  <div v-if="errors.gender" class="error-message">{{ errors.gender }}</div>
                </div>
              </div>

              <div class="col-12 col-md-6 mb-3 mb-md-0">
                <div class="form-group">
                  <label for="age" class="form-label">Age:</label>
                  <input
                    type="number"
                    class="form-control"
                    id="age"
                    v-model="formData.age"
                    @blur="() => validateAge(true)"
                    @input="() => validateAge(false)"
                    min="1"
                    max="100"
                    placeholder="Please enter your age"
                    required
                  />
                  <div v-if="errors.age" class="error-message">{{ errors.age }}</div>
                </div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-12 col-md-6 mb-3 mb-md-0">
                <div class="form-group">
                  <label for="postcode" class="form-label">Location Postcode:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="postcode"
                    v-model="formData.postcode"
                    @blur="() => validatePostcode(true)"
                    @input="() => validatePostcode(false)"
                    placeholder="Enter your postcode"
                    pattern="[0-9]{4}"
                    maxlength="4"
                    required
                  />
                  <div v-if="errors.postcode" class="error-message">{{ errors.postcode }}</div>
                </div>
              </div>

              <div class="col-12 col-md-6 mb-3 mb-md-0">
                <div class="form-group">
                  <label for="sport" class="form-label">Preferred Sport:</label>
                  <select
                    id="sport"
                    class="form-select"
                    v-model="formData.sport"
                    @change="() => validateSport(false)"
                  >
                    <option value="">Select sport</option>
                    <option value="running">Running</option>
                    <option value="basketball">Basketball</option>
                    <option value="swimming">Swimming</option>
                    <option value="yoga">Yoga</option>
                    <option value="football">Football</option>
                    <option value="tennis">Tennis</option>
                    <option value="gym">Gym</option>
                    <option value="walking">Walking</option>
                    <option value="other">Other</option>
                  </select>
                  <div v-if="errors.sport" class="error-message">{{ errors.sport }}</div>
                </div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-12">
                <div class="form-group">
                  <label for="time" class="form-label">Preferred Time:</label>
                  <select
                    id="time"
                    class="form-select"
                    v-model="formData.time"
                    @blur="() => validateTime(true)"
                    @change="() => validateTime(false)"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (6AM-12PM)</option>
                    <option value="afternoon">Afternoon (12PM-6PM)</option>
                    <option value="evening">Evening (6PM-8PM)</option>
                  </select>
                  <div v-if="errors.time" class="error-message">{{ errors.time }}</div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 text-center">
                <button type="submit" class="btn btn-primary btn-lg px-4 py-2">
                  Find Available Sports
                </button>
              </div>
            </div>
          </form>
        </div>

        <div v-if="showResults" class="results-section mt-6">
          <h2 class="results-title">Activities ({{ searchResults.length }})</h2>
          
          <div v-if="searchResults.length === 0" class="no-results">
            <p class="result-title">No activities found match your preferences. Try different options.</p>
          </div>
          
          <div v-else class="activities-found">
            <div class="row g-4">
              <div
                v-for="activity in searchResults"
                :key="activity.sportid"
                class="col-12 col-md-6 mb-3 mb-md-0"
              >
                <div class="card-activities-display">
                  <div class="card-activities-body">
                    <h5 class="card-activities-title">{{ activity.name }}</h5>
                    <p class="card-activities-text">
                      {{ activity.description}}
                    </p>

                    <ul class="list-unstyled small mb-3">
                      <li>Location:{{ activity.location }}</li>
                      <li>Time: {{ activity.time }}</li>
                      <li>Participants: {{ activity.currentParticipants }}</li>
                      <li>Contact: {{ activity.contact }}</li>
                    </ul>

                    <button class="btn btn-success btn-lg w-50 mt-auto">Join Activity</button>
                  </div>
                </div>
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
import Header from './HeaderPage.vue'
import Footer from './FooterPage.vue'
import { ref, onMounted } from 'vue'
import { auth } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useRouter } from 'vue-router'
import { validateAge as validateAgeUtil, validatePostcode as validatePostcodeUtil, sanitizeInput } from '../utils/security.js'
import { activitiesData } from '../data/activities.js'

const router = useRouter()
const currentUser = ref(null)
const userRole = ref(null)

const formData = ref({
  gender: '',
  age: '',
  postcode: '',
  sport: '',
  time: '',
})

const errors = ref({
  gender: null,
  age: null,
  postcode: null,
  sport: null,
  time: null,
})


const searchResults = ref([])
const showResults = ref(false)

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

const validateAge = (blur) => {
  const age = formData.value.age
  if (!age) {
    if (blur) errors.value.age = 'Age is required'
  } else if (!validateAgeUtil(age)) {
    if (blur) errors.value.age = 'Age must be between 1 and 100'
  } else {
    errors.value.age = null
  }
}

const validatePostcode = (blur) => {
  const postcode = formData.value.postcode
  if (!postcode) {
    if (blur) errors.value.postcode = 'Postcode is required'
  } else if (!validatePostcodeUtil(postcode)) {
    if (blur)
      errors.value.postcode =
        'Postcode must begin with 3(this web only support sports in Greater Melbourne area) and must be 4 digits'
  } else {
    errors.value.postcode = null
  }
}

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = 'Please select a gender'
  } else {
    errors.value.gender = null
  }
}
const validateTime = (blur) => {
  if (!formData.value.time) {
    if (blur) errors.value.time = 'Please select a time'
  } else {
    errors.value.time = null
  }
}

const findSports = () => {
  validateAge(true)
  validatePostcode(true)
  validateGender(true)
  validateTime(true)

  if (
    errors.value.age ||
    errors.value.postcode ||
    errors.value.gender ||
    errors.value.sport ||
    errors.value.time
  ) {
    return
  }


  const cleanSport = sanitizeInput(formData.value.sport)
  const cleanTime = sanitizeInput(formData.value.time)
  const cleanPostcode = sanitizeInput(formData.value.postcode)

  const results = []
  for (let i = 0; i < activitiesData.length; i++) {
    const activity = activitiesData[i]
    let match = true
    
    if (cleanSport && activity.sport !== cleanSport) {
      match = false
    }
    
    if (cleanTime && activity.time !== cleanTime) {
      match = false
    }
    
    if (cleanPostcode && activity.postcode.indexOf('3') !== 0) {
      match = false
    }
    
    if (match) {
      results.push(activity)
    }
  }

  searchResults.value = results
  showResults.value = true
  
}
</script>

<style scoped>
.activities-content {
  flex: 1;
  padding: 2rem 0;
  background: linear-gradient(to bottom, #fff4e6, #f8f9fa);
}
.content-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: white;
}
.main-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #000000;
  text-align: center;
}
.subtitle {
  font-size: 1.1rem;
  color: #505050;
  margin-bottom: 3rem;
  text-align: center;
}
.preference-form {
  max-width: 800px;
  margin: 0 auto;
}
.form-group {
  margin-bottom: 0;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  text-align: left;
}

.results-section {
  background-color: #ffffff;
  padding: 2rem;
}

.results-title {
  color: #000000;
  margin-bottom: 1.5rem;
  text-align: center;
}

.activities-content .activities-found {
  display: grid;
  gap: 1.5rem;
}

.card-activities-display {
  border: 2px solid #e0e5e9;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: #ffffff;
  overflow: hidden;
}

.card-activities-display:hover {
  border-color: #007bff;
  box-shadow: 0 8px 16px rgba(0, 123, 255, 0.15);
  transform: translateY(-2px);
}

.card-activities-body {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-activities-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.card-activities-text {
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.5;
  flex-grow: 1;
}

.card-activities-display .list-unstyled {
  margin-bottom: 1.5rem;
}

.card-activities-display .list-unstyled li {
  padding: 0.25rem 0;
  color: #495057;
  font-size: 0.9rem;
}

.card-activities-display .btn-success {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.card-activities-display .btn-success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}


.activity-details p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.no-results {
  text-align: center;
  padding: 2rem;
}

.user-info-header {
  text-align: center;
  margin-bottom: 2rem;
}
</style>
