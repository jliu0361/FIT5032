<template>
  <div class="movemate-app">
    <Header />

    <main class="activities-content">
      <div class="content-container">
        <div class="form-section">
          <h1 class="main-title">Find Your Preferred Sport Activity</h1>
          <p class="subtitle">Join activities that match your preferences!</p>
          <form class="preference-form" @submit.prevent="findSports">
            <div class="form-group">
              <label for="gender">Gender:</label>
              <select
                id="gender"
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

            <div class="form-group">
              <label for="age">Age:</label>
              <input
                type="number"
                id="age"
                v-model="formData.age"
                @blur="() => validateAge(true)"
                @input="() => validateAge(false)"
                min="1"
                max="120"
                placeholder="Please enter your age"
                required
              />
              <div v-if="errors.age" class="error-message">{{ errors.age }}</div>
            </div>

            <div class="form-group">
              <label for="postcode">Location Postcode:</label>
              <input
                type="text"
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

            <div class="form-group">
              <label for="sport">Preferred Sport:</label>
              <select id="sport" v-model="formData.sport" @change="() => validateSport(false)">
                <option value="">Select sport</option>
                <option value="running">Running</option>
                <option value="basketball">Basketball</option>
                <option value="swimming">Swimming</option>
                <option value="cycling">Cycling</option>
                <option value="yoga">Yoga</option>
                <option value="football">Football</option>
                <option value="tennis">Tennis</option>
                <option value="gym">Gym</option>
                <option value="walking">Walking</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.sport" class="error-message">{{ errors.sport }}</div>
            </div>

            <div class="form-group">
              <label for="time">Preferred Time:</label>
              <select
                id="time"
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

            <button type="submit" class="submit-button">Find Available Sports</button>
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
  } else if (age > 120) {
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
}
.content-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
  margin: 0 auto;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.form-group select:focus {
  outline: none;
  border-color: #2f01ff;
}

.error-message {
  color: #ff0019;
  font-size: 0.9rem;
  margin-top: 0.3rem;
  text-align: left;
}

.form-group input {
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  background-color: white;
}

.form-group input:focus {
  outline: none;
  border-color: #2f01ff;
  box-shadow: 0 0 0 0.2rem rgba(4, 193, 214, 0.25);
}
</style>
