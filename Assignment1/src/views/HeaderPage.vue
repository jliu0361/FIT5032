<template>
  <header class="header-gradient">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-12 col-md-4 col-lg-3">
          <router-link to="/" class="text-decoration-none">
            <h1 class="fw-bold text-white mb-3">SportMate</h1>
          </router-link>
        </div>

        <div class="col-12 col-md-8 col-lg-9">
          <nav class="nav justify-content-md-end justify-content-center">
            <router-link to="/" class="nav-link text-white fw-bold px-2">Home</router-link>
            <router-link to="/activities" class="nav-link text-white fw-bold px-2">Join Activities</router-link>
            <router-link to="/wellbeing" class="nav-link text-white fw-bold px-2">Wellbeing & Support</router-link>
            <router-link to="/contact" class="nav-link text-white fw-bold px-2">Contact</router-link>
            <router-link v-if="!isLoggedIn" to="/login" class="nav-link text-white fw-bold px-2">Login</router-link>
            <button v-else @click="logout" class="nav-link text-white fw-bold px-2 btn btn-link p-0">Logout</button>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase.js'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const router = useRouter()
const isLoggedIn = ref(false)

const logout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user
  })
})
</script>

<style scoped>
.header-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-link {
  transition: all 0.3s ease;
  border-radius: 6px;
  margin: 0 0.25rem;
  padding: 0.5rem 0.75rem !important;
}

.nav-link:hover {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.1);
  text-decoration: none;
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff !important;
}
</style>
