<template>
  <div class="movemate-app">
    <Header />

    <main class="activities-content">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">All Sports Activities</h1>
          <p class="page-subtitle">Browse all available sports activities and find the ones that suit you</p>
        </div>

        <div class="table-responsive">
          <table class="table table-striped align-middle">
            <thead>
              <tr>
                <th @click="toggleSort('name')" class="sortable">Name <span v-if="sort.key==='name'">{{ sort.direction==='asc' ? '↑' : '↓' }}</span></th>
                <th @click="toggleSort('sport')" class="sortable">Sport <span v-if="sort.key==='sport'">{{ sort.direction==='asc' ? '↑' : '↓' }}</span></th>
                <th @click="toggleSort('location')" class="sortable">Location <span v-if="sort.key==='location'">{{ sort.direction==='asc' ? '↑' : '↓' }}</span></th>
                <th @click="toggleSort('postcode')" class="sortable">Postcode <span v-if="sort.key==='postcode'">{{ sort.direction==='asc' ? '↑' : '↓' }}</span></th>
                <th @click="toggleSort('time')" class="sortable">Time <span v-if="sort.key==='time'">{{ sort.direction==='asc' ? '↑' : '▼' }}</span></th>
                <th>Action</th>
              </tr>
              <tr class="filter-row">
                <th :colspan="6">
                  <input v-model="query" @click.stop type="text" class="form-control form-control-sm" placeholder="Search for all the column" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activity in pagedActivities" :key="activity.sportid">
                <td>{{ activity.name }}</td>
                <td>{{ activity.sport }}</td>
                <td>{{ activity.location }}</td>
                <td>{{ activity.postcode }}</td>
                <td>{{ activity.time }}</td>
                <td>
                  <button class="btn btn-success btn-sm" @click="joinActivity(activity)">Join</button>
                </td>
              </tr>
              <tr v-if="pagedActivities.length === 0">
                <td colspan="6" class="text-center text-muted py-4">No activities found, please adjust ur input</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination d-flex justify-content-between align-items-center">
          <div>
            <label class="me-2">Rows in this page</label>
            <select v-model.number="pageSize" class="form-select d-inline-block w-auto">
              <option :value="10">10</option>
            </select>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-secondary" :disabled="page === 1" @click="page--">Prev</button>
            <span>Page {{ page }} / {{ totalPages }}</span>
            <button class="btn btn-outline-secondary" :disabled="page === totalPages" @click="page++">Next</button>
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

import { auth, db } from '../firebase.js'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const router = useRouter()

const page = ref(1)
const pageSize = ref(10)
const sort = ref({ key: 'name', direction: 'asc' })
const query = ref('')

const toggleSort = (key) => {
  if (sort.value.key === key) {
    sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.key = key
    sort.value.direction = 'asc'
  }
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return activitiesData
  return activitiesData.filter(a => {
    const values = [a.name, a.sport, a.location, a.postcode, a.time]
    return values.some(v => (v ?? '').toString().toLowerCase().includes(q))
  })
})

const sorted = computed(() => {
  return filtered.value
})

const totalPages = computed(() => Math.max(1, Math.ceil(sorted.value.length / pageSize.value)))
const pagedActivities = computed(() => {
  if (page.value > totalPages.value) page.value = totalPages.value
  const start = (page.value - 1) * pageSize.value
  return sorted.value.slice(start, start + pageSize.value)
})

const joinActivity = async (activity) => {
  try {
    const user = auth.currentUser
    if (!user) {
      router.push('/login')
      return
    }

    const appointmentRef = doc(db, 'users', user.uid, 'appointments', String(activity.sportid))
    await setDoc(
      appointmentRef,
      {
        sportid: activity.sportid,
        name: activity.name,
        sport: activity.sport,
        location: activity.location,
        postcode: activity.postcode,
        time: activity.time,
        contact: activity.contact,
        ageRange: activity.ageRange,
        joinedAt: serverTimestamp(),
      },
      { merge: true }
    )

    alert('Joined successfully! You can view it under Wellbeing & Support -> Current Appointments.')
  } catch (error) {
    alert('Failed to join activity. Please try again later.')
  }
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
.table-responsive {
  margin-bottom: 2rem;
}
</style>