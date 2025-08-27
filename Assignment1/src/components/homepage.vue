<template>
  <div class="movemate-app">
    <Header />
    
    <main class="main-content">
      <div class="content-container">
        <div class="form-section">
          <h1 class="main-title">Find Your Perfect Sport Activity</h1>
          <p class="subtitle">Tell us about your preferences and we'll find the best sports activities for you</p>
          
          <form class="preference-form" @submit.prevent="findSports">
            <div class="form-group">
              <label for="gender">Gender:</label>
              <select id="gender" v-model="formData.gender" required>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="sport">Preferred Sport:</label>
              <select id="sport" v-model="formData.sport" required>
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
            </div>
            
            <div class="form-group">
              <label for="time">Preferred Time:</label>
              <select id="time" v-model="formData.time" required>
                <option value="">Select time</option>
                <option value="morning">Morning (6AM-12PM)</option>
                <option value="afternoon">Afternoon (12PM-6PM)</option>
                <option value="evening">Evening (6PM-10PM)</option>
                <option value="flexible">Flexible</option>
              </select>
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
  sport: '',
  time: ''
})

const findSports = () => {
  console.log('Form submitted:', formData.value)
  alert('Finding sports for you...')
}
</script>

<style scoped>

</style>
