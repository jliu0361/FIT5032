<template>
  <div class="admin-panel">
    <h1>Admin Panel</h1>
    <p>Welcome, Admin! Manage activities and view users.</p>
    
    <div class="add-activity">
      <h2>Add New Activity</h2>
      <form @submit.prevent="addActivity">
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="activity-name">Activity Name:</label>
              <input 
                id="activity-name"
                v-model="newActivity.name" 
                type="text" 
                class="form-control"
                placeholder="Enter activity name"
                required
                :disabled="loading"
              />
            </div>
          </div>
          
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="activity-location">Location:</label>
              <input 
                id="activity-location"
                v-model="newActivity.location" 
                type="text" 
                class="form-control"
                placeholder="Enter location"
                required
                :disabled="loading"
              />
            </div>
          </div>
          
          <div class="col-12">
            <div class="form-group">
              <label for="activity-description">Description:</label>
              <textarea 
                id="activity-description"
                v-model="newActivity.description" 
                class="form-control"
                placeholder="Enter activity description"
                rows="3"
                :disabled="loading"
              ></textarea>
            </div>
          </div>
          
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label for="activity-date">Date:</label>
              <input 
                id="activity-date"
                v-model="newActivity.date" 
                type="date" 
                class="form-control"
                required
                :disabled="loading"
              />
            </div>
          </div>
          
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label for="activity-time">Time:</label>
              <input 
                id="activity-time"
                v-model="newActivity.time" 
                type="time" 
                class="form-control"
                required
                :disabled="loading"
              />
            </div>
          </div>
          
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label for="activity-max-participants">Max Participants:</label>
              <input 
                id="activity-max-participants"
                v-model.number="newActivity.maxParticipants" 
                type="number" 
                class="form-control"
                min="1"
                placeholder="Enter max participants"
                required
                :disabled="loading"
              />
            </div>
          </div>
          
          <div class="col-12">
            <button type="submit" :disabled="loading" class="btn btn-success">
              {{ loading ? 'Adding...' : 'Add Activity' }}
            </button>
          </div>
        </div>
      </form>
      
      <div v-if="message" class="message" :class="messageType">
        {{ message }}
      </div>
    </div>
    
    <div class="user-management">
      <h2>All Users</h2>
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">{{ users.length }}</h5>
              <p class="card-text">Total Users</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">{{ adminCount }}</h5>
              <p class="card-text">Admin Users</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">{{ regularUserCount }}</h5>
              <p class="card-text">Regular Users</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row g-3">
        <div v-for="user in users" :key="user.id" class="col-12 col-md-6 col-lg-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ user.email }}</h5>
              <p class="card-text">
                <strong>Role:</strong> 
                <span :class="['role-badge', user.role]">{{ user.role }}</span>
              </p>
              <p class="card-text">
                <small class="text-muted">Joined: {{ formatDate(user.createdAt) }}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { auth, db } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore'

const users = ref([])
const loading = ref(false)
const message = ref('')
const messageType = ref('')

const newActivity = ref({
  name: '',
  description: '',
  location: '',
  date: '',
  time: '',
  maxParticipants: 1
})

const adminCount = computed(() => {
  let count = 0
  for (let i = 0; i < users.value.length; i++) {
    if (users.value[i].role === 'admin') {
      count++
    }
  }
  return count
})

const regularUserCount = computed(() => {
  let count = 0
  for (let i = 0; i < users.value.length; i++) {
    if (users.value[i].role === 'user') {
      count++
    }
  }
  return count
})

const addActivity = async () => {
  loading.value = true
  message.value = ''
  
  try {
    await addDoc(collection(db, 'activities'), {
      name: newActivity.value.name,
      description: newActivity.value.description,
      location: newActivity.value.location,
      date: newActivity.value.date,
      time: newActivity.value.time,
      maxParticipants: newActivity.value.maxParticipants,
      currentParticipants: 0,
      createdBy: auth.currentUser.uid,
      createdAt: serverTimestamp()
    })
    
    message.value = 'Activity added successfully!'
    messageType.value = 'success'
    
    newActivity.value = {
      name: '',
      description: '',
      location: '',
      date: '',
      time: '',
      maxParticipants: 1
    }
    
  } catch (error) {
    console.error('Error adding activity:', error)
    message.value = 'Error adding activity. Please try again.'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}


const loadUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    users.value = []
    usersSnapshot.forEach((doc) => {
      users.value.push({
        id: doc.id,
        ...doc.data()
      })
    })
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString()
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadUsers()
    }
  })
})

</script>

<style scoped>
.admin-panel {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.add-activity, .user-management {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.message {
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}


.role-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.role-badge.user {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-badge.admin {
  background-color: #fff3e0;
  color: #f57c00;
}

</style>