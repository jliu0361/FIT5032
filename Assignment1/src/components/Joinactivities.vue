<template>
  <div class="movemate-app">
    <Header />

    <main class="activities-content">
      <div class="content-container">
        <div class="form-section">
          <h1 class="main-title">Find Your Preferred Sport Activity</h1>
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

              <div class="col-12 col-md-6">
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

              <div class="col-12 col-md-6">
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
                    <option value="flexible">Flexible(Anytime Available)</option>
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
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Header from './header.vue'
import Footer from './footer.vue'
import { ref } from 'vue'

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

const validateAge = (blur) => {
  const age = formData.value.age
  if (!age) {
    if (blur) errors.value.age = 'Age is required'
  } else if (age < 1) {
    if (blur) errors.value.age = 'Age can not less than 1'
  } else if (age > 100) {
    if (blur) errors.value.age = 'Age exceeds the age suitable for sports'
  } else {
    errors.value.age = null
  }
}

const validatePostcode = (blur) => {
  const postcode = formData.value.postcode
  if (!postcode) {
    if (blur) errors.value.postcode = 'Postcode is required'
  } else if (!/^3\d{3}$/.test(postcode)) {
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
    console.log('Form has validation errors')
    return
  }

  console.log('Form submitted:', formData.value)
  alert('Finding sports for you...')
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
</style>
