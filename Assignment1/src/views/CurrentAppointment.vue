<template>
  <div class="movemate-app">
    <Header />
    <main class="wellbeing-content">
      <div class="content-container">
        <h1 class="main-title">Current Appointments</h1>

        

        <div class="table-responsive">
          <table class="table table-striped align-middle">
            <thead>
              <tr>
                <th v-for="col in columns" :key="col.key" @click="toggleSort(col.key)" class="sortable">
                  <div class="d-flex align-items-center gap-2">
                    <span>{{ col.label }}</span>
                    <span v-if="sort.key === col.key">{{ sort.direction === 'asc' ? '▲' : '▼' }}</span>
                  </div>
                </th>
              </tr>
              <tr class="filter-row">
                <th>
                  <input type="text" v-model="filters.name" @click.stop class="form-control form-control-sm w-100" placeholder="Search" />
                </th>
                <th>
                  <input type="text" v-model="filters.sport" @click.stop class="form-control form-control-sm w-100" placeholder="Search" />
                </th>
                <th>
                  <input type="text" v-model="filters.location" @click.stop class="form-control form-control-sm w-100" placeholder="Search" />
                </th>
                <th>
                  <input type="text" v-model="filters.postcode" @click.stop class="form-control form-control-sm w-100" placeholder="Search" />
                </th>
                <th>
                  <input type="text" v-model="filters.time" @click.stop class="form-control form-control-sm w-100" placeholder="Search" />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="appt in pagedAppointments" :key="appt.sportid">
                <td>{{ appt.name }}</td>
                <td>{{ appt.sport }}</td>
                <td>{{ appt.location }}</td>
                <td>{{ appt.postcode }}</td>
                <td>{{ appt.time }}</td>
                <td>{{ formatDate(appt.joinedAt) }}</td>
              </tr>
              <tr v-if="pagedAppointments.length === 0">
                <td :colspan="columns.length" class="text-center text-muted py-4">No appointments found</td>
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
import Header from './HeaderPage.vue'
import Footer from './FooterPage.vue'
import { ref, computed, onMounted } from 'vue'
import { auth, db } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()

const appointments = ref([])
const page = ref(1)
const pageSize = ref(10)
const sort = ref({ key: 'joinedAt', direction: 'desc' })
const nameQuery = ref('')
const filters = ref({ name: '', sport: '', location: '', postcode: '', time: '' })

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'sport', label: 'Sport' },
  { key: 'location', label: 'Location' },
  { key: 'postcode', label: 'Postcode' },
  { key: 'time', label: 'Time' },
  { key: 'joinedAt', label: 'Joined At' },
]

const toggleSort = (key) => {
  if (sort.value.key === key) {
    sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.key = key
    sort.value.direction = 'asc'
  }
}

const sortedAppointments = computed(() => {
  const q = nameQuery.value.trim().toLowerCase()
  const f = filters.value
  const filtered = appointments.value.filter(a => {
    const matchName = q ? (a.name || '').toString().toLowerCase().includes(q) : true
    const matchSport = f.sport ? (a.sport || '').toString().toLowerCase().includes(f.sport.toLowerCase()) : true
    const matchLocation = f.location ? (a.location || '').toString().toLowerCase().includes(f.location.toLowerCase()) : true
    const matchPostcode = f.postcode ? (a.postcode || '').toString().toLowerCase().includes(f.postcode.toLowerCase()) : true
    const matchTime = f.time ? (a.time || '').toString().toLowerCase().includes(f.time.toLowerCase()) : true
    return matchName && matchSport && matchLocation && matchPostcode && matchTime
  })
  const arr = [...filtered]
  const { key, direction } = sort.value
  arr.sort((a, b) => {
    const va = a[key]
    const vb = b[key]
    // handle timestamp objects
    const aVal = va && va.toDate ? va.toDate().getTime() : (va ?? '').toString().toLowerCase()
    const bVal = vb && vb.toDate ? vb.toDate().getTime() : (vb ?? '').toString().toLowerCase()
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
  return arr
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedAppointments.value.length / pageSize.value)))

const pagedAppointments = computed(() => {
  if (page.value > totalPages.value) page.value = totalPages.value
  const start = (page.value - 1) * pageSize.value
  return sortedAppointments.value.slice(start, start + pageSize.value)
})

const formatDate = (ts) => {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString()
}

let unsubscribe = null
const startListener = (uid) => {
  const q = query(collection(db, 'users', uid, 'appointments'), orderBy('joinedAt', 'desc'))
  unsubscribe = onSnapshot(q, (snap) => {
    const list = []
    snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }))
    appointments.value = list
  })
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push('/login')
      return
    }
    if (unsubscribe) unsubscribe()
    startListener(user.uid)
  })
})
</script>

<style scoped>
.wellbeing-content {
  flex: 1;
  padding: 2rem 0;
  background: linear-gradient(to bottom, #fff4e6, #f8f9fa);
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 1rem;
  text-align: center;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.pagination {
  margin-top: 1rem;
}
</style>
