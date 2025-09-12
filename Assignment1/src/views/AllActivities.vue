<template>
  <div class="movemate-app">
    <Header />

    <main class="activities-content">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">All Sports Activities</h1>
          <p class="page-subtitle">Browse all available sports activities and find the ones that suit you</p>
        </div>

        <div class="row g-4">
          <div
            v-for="activity in activitiesData"
            :key="activity.sportid"
            class="col-12 col-md-6 mb-3 mb-md-0"
          >
            <div class="activity-card">
            <div class="activity-content">
              <h3 class="activity-name">{{ activity.name }}</h3>
              <p class="activity-description">{{ activity.description }}</p>
              
              <div class="activity-details">
                <div class="detail-item">Location: {{ activity.location }}</div>
                <div class="detail-item">Time: {{ activity.time }}</div>
                <div class="detail-item">Participants: {{ activity.currentParticipants }}</div>
                <div class="detail-item">Contact: {{ activity.contact }}</div>
                <div class="detail-item">Postcode: {{ activity.postcode }}</div>
                <div class="detail-item">Age Range: {{ activity.ageRange }}</div>
              </div>

              <div class="activity-actions">
                <button class="join-btn" @click="joinActivity(activity)">
                  Join Activity
                </button>
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
import { activitiesData } from '../data/activities.js'
import Header from './HeaderPage.vue'
import Footer from './FooterPage.vue'



const joinActivity = (activity) => {
  // wait for firebase logic 
  alert(`Would you like to join "${activity.name}"?\nContact: ${activity.contact}`)
}
</script>

<style scoped>
.movemate-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.activities-content {
  flex: 1;
  background: linear-gradient(to bottom, #fff4e6, #f8f9fa);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  margin: 0;
}


.activity-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 2px solid transparent;
}


.activity-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.activity-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.activity-description {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.activity-details {
  margin-bottom: 2rem;
  flex-grow: 1;
}

.detail-item {
  margin-bottom: 0.75rem;
  color: #495057;
}

.activity-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.join-btn {
  width: 100%;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}


</style>