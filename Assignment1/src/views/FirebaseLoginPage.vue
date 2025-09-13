<template>
  <div class="movemate-app">
    <Header />

    <main class="login-content">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="login-card">
              <div class="text-center mb-4">
                <h2 class="login-title">Welcome to SportMate</h2>
                <p class="login-subtitle">Sign in to your account or create a new one</p>
              </div>
              <form v-if="!showRegister" @submit.prevent="handleLogin" class="login-form">
                <div class="mb-3">
                  <label for="email-login" class="form-label">Email Address</label>
                  <input 
                    id="email-login" 
                    type="email" 
                    class="form-control" 
                    v-model="email" 
                    required 
                    :disabled="loading"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div class="mb-3">
                  <label for="password-login" class="form-label">Password</label>
                  <input 
                    id="password-login" 
                    type="password" 
                    class="form-control" 
                    v-model="password" 
                    required 
                    :disabled="loading"
                    placeholder="Enter your password"
                  />
                </div>
                
                <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ loading ? 'Signing in, wait a sec' : 'Sign In' }}
                </button>
              </form>

              <form v-else @submit.prevent="handleRegister" class="login-form">
                <div class="mb-3">
                  <label for="email-register" class="form-label">Email Address</label>
                  <input 
                    id="email-register" 
                    type="email" 
                    class="form-control" 
                    v-model="email" 
                    required 
                    :disabled="loading"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div class="mb-3">
                  <label for="password-register" class="form-label">Password</label>
                  <input 
                    id="password-register" 
                    type="password" 
                    class="form-control" 
                    v-model="password" 
                    required 
                    :disabled="loading"
                    placeholder="Create a password (min 6 characters)"
                  />
                  <div class="form-text">Password must be at least 6 characters long</div>
                </div>
                
                <button type="submit" class="btn btn-success w-100 mb-3" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ loading ? 'Creating Account...' : 'Create Account' }}
                </button>
              </form>
              
              <div class="text-center">
                <button @click="toggleForm" class="btn btn-link text-decoration-none">
                  {{ showRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up" }}
                </button>
              </div>
              
              <div v-if="error" class="alert alert-danger mt-3" role="alert">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="currentUser" class="user-dashboard">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="dashboard-card">
              <div class="text-center mb-4">
                <h3 class="dashboard-title">Welcome back!</h3>
                <p class="dashboard-subtitle">{{ currentUser.email }}</p>
              </div>
              
              <div class="row g-3 mb-4">
                <div class="col-12">
                  <div class="stat-card">
                    <div class="stat-number">{{ notes.length }}</div>
                    <div class="stat-label">Your Notes</div>
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2 mb-4">
                <router-link to="/" class="btn btn-primary">
                  Go to Home
                </router-link>
                <button @click="logout" class="btn btn-outline-secondary">
                  Sign Out
                </button>
              </div>

              <div class="notes-section">
                <h4 class="notes-title">Your Notes</h4>
                <div v-if="notes.length === 0" class="text-center text-muted py-3">
                  <p>No notes yet. Add your first note below!</p>
                </div>
                <div v-else class="notes-list">
                  <div v-for="note in notes" :key="note.id" class="note-item">
                    <div class="note-content">{{ note.text }}</div>
                    <button @click="removeNote(note.id)" class="btn btn-sm btn-outline-danger">
                      Delete
                    </button>
                  </div>
                </div>
                
                <form @submit.prevent="addNote" class="add-note-form">
                  <div class="input-group">
                    <input 
                      v-model="newText" 
                      type="text" 
                      class="form-control" 
                      placeholder="Add a new note..." 
                    />
                    <button type="submit" class="btn btn-outline-primary">
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase.js'
import { validateEmail, validatePassword, sanitizeInput } from '../utils/security.js'
import Header from './HeaderPage.vue'
import Footer from './FooterPage.vue'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  deleteDoc,
  doc,
  setDoc,
} from 'firebase/firestore'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showRegister = ref(false)
const currentUser = ref(null)

const notes = ref([])
const newText = ref('')
const unsubscribe = ref(null)

const notesCollection = collection(db, 'notes')

const handleRegister = async () => {
  error.value = ''
  loading.value = true
  
  try {
    if (!validateEmail(email.value)) {
      throw new Error('Invalid email format')
    }
    
    if (!validatePassword(password.value)) {
      throw new Error('Password should be at least 6 characters long.')
    }

    const cleanEmail = sanitizeInput(email.value)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password.value,
    )
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      role: 'user', 
      createdAt: serverTimestamp(),
      displayName: userCredential.user.displayName || '',
    })
    
    
    password.value = ''
    email.value = ''
    
    router.push('/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    
    password.value = ''
    email.value = ''
    
    router.push('/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const toggleForm = () => {
  error.value = ''
  showRegister.value = !showRegister.value
}

const logout = async () => {
  await auth.signOut()
}

const startNotesListener = (uid) => {
  const q = query(notesCollection, where('uid', '==', uid))
  unsubscribe.value = onSnapshot(q, (querySnapshot) => {
    const notesData = []
    querySnapshot.forEach((doc) => {
      notesData.push({ id: doc.id, ...doc.data() })
    })
    notes.value = notesData
  })
}

const stopNotesListener = () => {
  if (unsubscribe.value) {
    unsubscribe.value()
    unsubscribe.value = null
  }
  notes.value = []
}

const addNote = async () => {
  if (!currentUser.value || !newText.value.trim()) return
  await addDoc(notesCollection, {
    uid: currentUser.value.uid,
    text: newText.value.trim(),
    createdAt: serverTimestamp(),
  })
  newText.value = ''
}

const removeNote = async (id) => {
  await deleteDoc(doc(db, 'notes', id))
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    stopNotesListener()
    if (user) startNotesListener(user.uid)
  })
})

onBeforeUnmount(stopNotesListener)
</script>

<style scoped>
.movemate-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.login-content {
  flex: 1;
  padding: 4rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  background: white;
  border-radius: 15px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-title {
  color: #333;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #666;
  font-size: 1rem;
}

.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-control {
  border-radius: 8px;
  border: 2px solid #e9ecef;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(86, 171, 47, 0.4);
}

.btn-link {
  color: #667eea;
  font-weight: 500;
}

.btn-link:hover {
  color: #764ba2;
}

.user-dashboard {
  flex: 1;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.dashboard-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  color: #333;
  font-weight: 700;
}

.dashboard-subtitle {
  color: #666;
  font-size: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.notes-section {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

.notes-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 1rem;
}

.note-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.note-content {
  flex: 1;
  color: #333;
}

.add-note-form {
  margin-top: 1rem;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.alert {
  border-radius: 8px;
}
</style>