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
                <th @click="toggleSort('name')" class="sortable">Name <span v-if="sort.key==='name'">{{ sort.direction==='asc' ? '▲' : '▼' }}</span></th>
                <th @click="toggleSort('sport')" class="sortable">Sport <span v-if="sort.key==='sport'">{{ sort.direction==='asc' ? '▲' : '▼' }}</span></th>
                <th @click="toggleSort('location')" class="sortable">Location <span v-if="sort.key==='location'">{{ sort.direction==='asc' ? '▲' : '▼' }}</span></th>
                <th @click="toggleSort('postcode')" class="sortable">Postcode <span v-if="sort.key==='postcode'">{{ sort.direction==='asc' ? '▲' : '▼' }}</span></th>
                <th @click="toggleSort('time')" class="sortable">Time <span v-if="sort.key==='time'">{{ sort.direction==='asc' ? '▲' : '▼' }}</span></th>
                <th @click="toggleSort('currentParticipants')" class="sortable">Participants <span v-if="sort.key==='currentParticipants'">{{ sort.direction==='asc' ? '▲' : '▼' }}</span></th>
                <th>Action</th>
              </tr>
              <tr class="filter-row">
                <th><input v-model="filters.name" @click.stop type="text" class="form-control form-control-sm" placeholder="Search" /></th>
                <th><input v-model="filters.sport" @click.stop type="text" class="form-control form-control-sm" placeholder="Search" /></th>
                <th><input v-model="filters.location" @click.stop type="text" class="form-control form-control-sm" placeholder="Search" /></th>
                <th><input v-model="filters.postcode" @click.stop type="text" class="form-control form-control-sm" placeholder="Search" /></th>
                <th><input v-model="filters.time" @click.stop type="text" class="form-control form-control-sm" placeholder="Search" /></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activity in pagedActivities" :key="activity.sportid">
                <td>{{ activity.name }}</td>
                <td>{{ activity.sport }}</td>
                <td>{{ activity.location }}</td>
                <td>{{ activity.postcode }}</td>
                <td>{{ activity.time }}</td>
                <td>{{ activity.currentParticipants }}</td>
                <td>
                  <button class="btn btn-success btn-sm" @click="joinActivity(activity)">Join</button>
                </td>
              </tr>
              <tr v-if="pagedActivities.length === 0">
                <td colspan="7" class="text-center text-muted py-4">No activities found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination d-flex justify-content-between align-items-center">
          <div>
            <label class="me-2">Rows per page</label>
            <select v-model.number="pageSize" class="form-select d-inline-block w-auto">
              <option :value="2">2</option>
              <option :value="5">5</option>
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
const filters = ref({ name: '', sport: '', location: '', postcode: '', time: '' })

const toggleSort = (key) => {
  if (sort.value.key === key) {
    sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.key = key
    sort.value.direction = 'asc'
  }
}

const filtered = computed(() => {
  const f = filters.value
  return activitiesData.filter((a) =>
    (!f.name || (a.name || '').toLowerCase().includes(f.name.toLowerCase())) &&
    (!f.sport || (a.sport || '').toLowerCase().includes(f.sport.toLowerCase())) &&
    (!f.location || (a.location || '').toLowerCase().includes(f.location.toLowerCase())) &&
    (!f.postcode || (a.postcode || '').toLowerCase().includes(f.postcode.toLowerCase())) &&
    (!f.time || (a.time || '').toLowerCase().includes(f.time.toLowerCase()))
  )
})

const sorted = computed(() => {
  const arr = [...filtered.value]
  const { key, direction } = sort.value
  arr.sort((a, b) => {
    const va = (a[key] ?? '').toString().toLowerCase()
    const vb = (b[key] ?? '').toString().toLowerCase()
    if (va < vb) return direction === 'asc' ? -1 : 1
    if (va > vb) return direction === 'asc' ? 1 : -1
    return 0
  })
  return arr
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
        currentParticipants: activity.currentParticipants,
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